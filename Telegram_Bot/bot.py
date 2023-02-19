import os
from telegram import Update, ReplyKeyboardRemove, ReplyKeyboardMarkup
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from messages import start_message, help_message, \
    loginParametersError_message, loginFailed_message, loginSuccess_message, alreadyLogged_message, \
    unknownCommand_message, logoutSuccess_message, logoutFailed_message, notLogged_message
import configparser
import requests
import sqlite3
from geopy.distance import geodesic as gd
import threading
import time

config = configparser.ConfigParser()
if not config.read('config.ini'):
    print("Please write a config.ini file")
    exit(1)

create_DB = False
if(os.path.isfile('botDB.db') == False):
    create_DB = True


#DB Creation
db = sqlite3.connect('botDB.db')
curs = db.cursor()


def distanceControl(stations):
    stations_alarm = set()

    for s1 in stations:
        for s2 in stations:
            if (s1['id'] != s2['id']):
                dist = gd((s1['latitude'], s1['longitude']), (s2['latitude'], s2['longitude'])).m
                if (dist < 300):
                    stations_alarm.add(s1['id'])
                    stations_alarm.add(s2['id'])

    return stations_alarm


users = []

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text=start_message)


async def help(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text=help_message)


async def foodStation(update: Update, context: ContextTypes.DEFAULT_TYPE):
    curs.execute("SELECT * FROM users")
    users = curs.fetchall()
    user = ''
    headers = {'X-API-KEY': ''}

    #Controllo che sia loggato
    for u in users:
        if(update.effective_chat.id == u[1]):
            user = u[0]
            headers['X-API-KEY'] = u[2]
            break

    if(user == ''):
        await context.bot.send_message(chat_id=update.effective_chat.id, text=notLogged_message)
        return

    stations = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                            f'{user}/stations', headers=headers).json()

    for elem in stations:
        str = []
        foods = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                            f'{user}/stations/{elem["id"]}/foods', headers=headers).json()
        waters = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                             f'{user}/stations/{elem["id"]}/waters', headers=headers).json()

        str.append("Station #%d\nLatitude: %f\nLongitude: %f\n" % (elem["id"], elem["latitude"], elem["longitude"]))
        str.append("\nFood Level: ")

        for f in foods:
            str.append("%s\n" % f["value"].upper())
            break

        str.append("Water Level: ")

        for w in waters:
            str.append("%s\n" % w["value"].upper())
            break

        await context.bot.send_message(chat_id=update.effective_chat.id, text=''.join(str))


async def petStatus(update: Update, context: ContextTypes.DEFAULT_TYPE):
    curs.execute("SELECT * FROM users")
    users = curs.fetchall()
    user = ''
    headers = {'X-API-KEY': ''}

    # Controllo che sia loggato
    for u in users:
        if (update.effective_chat.id == u[1]):
            user = u[0]
            headers['X-API-KEY'] = u[2]
            break

    if (user == ''):
        await context.bot.send_message(chat_id=update.effective_chat.id, text=notLogged_message)
        return

    stations = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                            f'{user}/stations', headers=headers).json()

    for elem in stations:
        str = []
        animals = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                            f'{user}/stations/{elem["id"]}/animals', headers=headers).json()

        str.append("Station #%d\n" % elem["id"])

        for a in animals:
            meals = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                                 f'{user}/stations/{elem["id"]}/animals/{a["id"]}/meals', headers=headers).json()
            beats = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                                 f'{user}/stations/{elem["id"]}/animals/{a["id"]}/beats', headers=headers).json()
            weights = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                                   f'{user}/stations/{elem["id"]}/animals/{a["id"]}/weights', headers=headers).json()

            str.append("\n%s (ID: %d):\n" % (a["name"], a["id"]))
            str.append("\t-\tBark: %s\n" % a["bark"])
            if a["temperature"] == None:
                str.append("\t-\tTemperature: null\n")
            else:
                str.append("\t-\tTemperature: %d°C\n" % a["temperature"])

            for b in beats:
                str.append("\t-\tBeats: %dbpm\n" % b['value'])
                break

            for w in weights:
                str.append("\t-\tWeight: %dkg\n" % w['value'])
                break

            str.append("\n\tProgrammed meals:\n\n")
            meals.reverse()
            for m in meals:
                str.append("\t-\tTime: %s\n" % m['time'])
                str.append("\t-\tMeal type: %s\n" % m['meal_type'])
                str.append("\t-\tQuantity: %dg\n\n" % m['quantity'])

        await context.bot.send_message(chat_id=update.effective_chat.id, text=''.join(str))


async def login(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global users
    if(len(context.args) != 2):
        await context.bot.send_message(chat_id=update.effective_chat.id, text=loginParametersError_message)
        return

    username = context.args[0]
    password = context.args[1]

    data = {
        'password': password,
        'username': username
    }

    raw_token = requests.post(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/login', json=data)
    token = raw_token.content.decode("utf-8")

    if(raw_token.status_code == 401):
        await context.bot.send_message(chat_id=update.effective_chat.id, text=loginFailed_message)
        return

    curs.execute("SELECT * FROM users")
    users = curs.fetchall()

    #Controllo che il chat_id non sia associato ad altri user
    for u in users:
        if(update.effective_chat.id == u[1]):
            await context.bot.send_message(chat_id=update.effective_chat.id, text=(alreadyLogged_message % u[0]))
            return

    curs.execute("INSERT INTO users VALUES ('%s', %d, '%s')" % (username, update.effective_chat.id, token))
    db.commit()
    curs.execute("SELECT * FROM users")
    users = curs.fetchall()
    await context.bot.send_message(chat_id=update.effective_chat.id, text=loginSuccess_message)
    reply_keyboard = [['/FoodStation', '/PetStatus'], ['/help', '/logout']]
    await update.message.reply_text(
        "What do you want to do?",
        reply_markup=ReplyKeyboardMarkup(
            reply_keyboard, one_time_keyboard=False, input_field_placeholder="Please select:"
        ),
    )


async def logout(update: Update, context: ContextTypes.DEFAULT_TYPE):
    global users
    curs.execute("SELECT * FROM users")
    users = curs.fetchall()

    for u in users:
        if (update.effective_chat.id == u[1]):
            curs.execute("DELETE FROM users WHERE chat_id=%d" % u[1])
            db.commit()
            curs.execute("SELECT * FROM users")
            users = curs.fetchall()
            await update.message.reply_text(
                logoutSuccess_message, reply_markup=ReplyKeyboardRemove()
            )
            return

    await context.bot.send_message(chat_id=update.effective_chat.id, text=logoutFailed_message)


async def unknown(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text=unknownCommand_message)


class myThread(threading.Thread):
    def __init__(self, threadID, token):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.token = token

    def run(self):
        print(f"[THREAD {self.threadID}] Sono partito")

        while True:
            print(f"[THREAD {self.threadID}] Eseguo il codice")
            print(f"[THREAD {self.threadID}] Gli utenti sono: {users}")

            stations = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/allStations').json()
            alarmed_stations = []
            for station in stations:
                if station['alarmed'] == 'True':
                    alarmed_stations.append(station)

            print(f"[THREAD {self.threadID}] Le stazioni allarmate sono: {alarmed_stations}")

            ids = distanceControl(alarmed_stations)

            for user in users:
                user_stations = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/{user[0]}/stations', headers={
                    'X-API-KEY': user[2]
                }).json()
                print(f"[THREAD {self.threadID}] L'utente {user[0]} ha le seguenti stazioni: ")
                for station in user_stations:
                    print(station['id'])
                    if station['id'] in ids:
                        print(f"[THREAD {self.threadID}] Spedisco il messaggio a {user[0]}")
                        url = f"https://api.telegram.org/bot{self.token}/sendMessage?chat_id={user[1]}&text=There+is+an+allarm+in+your+zone%21"
                        requests.get(url)

            print(f"[THREAD {self.threadID}] Vado in sleep")
            time.sleep(25)

def startBot():
    application = ApplicationBuilder().token(config.get('Telegram Bot', 'BOT_TOKEN')).build()

    start_handler = CommandHandler('start', start)
    application.add_handler(start_handler)

    help_handler = CommandHandler('help', help)
    application.add_handler(help_handler)

    login_handler = CommandHandler('login', login)
    application.add_handler(login_handler)

    logout_handler = CommandHandler('logout', logout)
    application.add_handler(logout_handler)

    foodstation_handler = CommandHandler('FoodStation', foodStation)
    application.add_handler(foodstation_handler)

    petstatus_handler = CommandHandler('PetStatus', petStatus)
    application.add_handler(petstatus_handler)

    unknown_handler = MessageHandler(filters.COMMAND, unknown)
    application.add_handler(unknown_handler)

    global users
    curs.execute("SELECT * FROM users")
    users = curs.fetchall()

    thread1 = myThread(1, config.get('Telegram Bot', 'BOT_TOKEN'))
    thread1.start()

    application.run_polling()

def initDB():
    curs.execute("""CREATE TABLE users (
            username text,
            chat_id integer,
            token text
        )
        """)
    db.commit()

if __name__ == '__main__':
    if(create_DB == True):
        initDB()

    startBot()