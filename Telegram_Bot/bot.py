import os
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
from messages import start_message, help_message, \
    loginParametersError_message, loginFailed_message, loginSuccess_message, alreadyLogged_message, \
    unknownCommand_message, logoutSuccess_message, logoutFailed_message, notLogged_message
import configparser
import requests
import sqlite3


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

        str.append("ID: %d, Latitude: %f, Longitude: %f\n" % (elem["id"], elem["latitude"], elem["longitude"]))
        str.append("\nFoods Level:\n")

        for f in foods:
            str.append("\t-\tFood %d: %s\n" % (f["id"], f["value"]))
            break

        str.append("\nWaters Level:\n")

        for w in waters:
            str.append("\t-\tWater %d: %s\n" % (w["id"], w["value"]))
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

        str.append("Station %d:\n" % elem["id"])

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
                str.append("\t-\tTemperature: %d\n" % a["temperature"])

            for b in beats:
                str.append("\t-\tBeats: %d\n" % b['value'])
                break

            for w in weights:
                str.append("\t-\tWeight: %dkg\n" % w['value'])
                break

            str.append("\n\tProgrammed meals:\n\n")
            meals.reverse()
            for m in meals:
                str.append("\t-\tTime: %s\n" % m['time'])
                str.append("\t-\tMeal type: %s\n" % m['meal_type'])
                str.append("\t-\tQuantity: %d\n\n" % m['quantity'])

        await context.bot.send_message(chat_id=update.effective_chat.id, text=''.join(str))


async def login(update: Update, context: ContextTypes.DEFAULT_TYPE):
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
    print(users)

    #Controllo che il chat_id non sia associato ad altri user
    for u in users:
        if(update.effective_chat.id == u[1]):
            await context.bot.send_message(chat_id=update.effective_chat.id, text=(alreadyLogged_message % u[0]))
            return

    curs.execute("INSERT INTO users VALUES ('%s', %d, '%s')" % (username, update.effective_chat.id, token))
    db.commit()
    await context.bot.send_message(chat_id=update.effective_chat.id, text=loginSuccess_message)



async def logout(update: Update, context: ContextTypes.DEFAULT_TYPE):
    curs.execute("SELECT * FROM users")
    users = curs.fetchall()

    for u in users:
        if (update.effective_chat.id == u[1]):
            curs.execute("DELETE FROM users WHERE chat_id=%d" % u[1])
            db.commit()
            await context.bot.send_message(chat_id=update.effective_chat.id, text=logoutSuccess_message)
            return

    await context.bot.send_message(chat_id=update.effective_chat.id, text=logoutFailed_message)


async def unknown(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.send_message(chat_id=update.effective_chat.id, text=unknownCommand_message)

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