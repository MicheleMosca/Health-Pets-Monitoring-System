import pandas as pd
from prophet import Prophet
import requests
import configparser
import plotly.express as px
from test_forecast import testProphet

config = configparser.ConfigParser()
if not config.read('config.ini'):
    print("Please write a config.ini file")
    exit(1)

def predict(user, station_id, animal_id, token, html_flag):
    headers = {'X-API-KEY': token}

    weights = requests.get(f'http://{config.get("Server", "HOST")}:{config.get("Server", "PORT")}/api/users/'
                           f'{user}/stations/{station_id}/animals/{animal_id}/weights', headers=headers).json()

    weights.reverse()
    weights_list = []

    for w in weights:
        dictionary = {'ds': w['timestamp'], 'yhat': w['value']}
        weights_list.append(dictionary)

    #Just for test
    weights_list = testProphet()
    print(weights_list)

    data = pd.DataFrame(weights_list)

    model = Prophet()
    model.fit(data)

    prediction = model.make_future_dataframe(periods=30)

    forecast = model.predict(prediction)

    fig = px.line(forecast[['ds', 'yhat']], x='ds', y='yhat', title='Pesi')

    if(html_flag == True):
        return fig.to_html()

    fig.show()
    #return fig.to_image(format='png')


if __name__ == '__main__':
    predict('michele', 1, 1, 'TOKEN', False)