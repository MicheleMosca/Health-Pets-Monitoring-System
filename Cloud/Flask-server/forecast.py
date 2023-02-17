import pandas as pd
from prophet import Prophet
import configparser
import plotly.express as px
from test_forecast import testProphet
import requests

config = configparser.ConfigParser()
if not config.read('config.ini'):
    print("Please write a config.ini file")
    exit(1)

def predict(weights):
    animal_weights = weights

    animal_weights.reverse()
    weights_list = []

    for aw in animal_weights:
        dictionary = {'ds': aw['timestamp'], 'yhat': aw['value']}
        weights_list.append(dictionary)

    #Just for test
    weights_list = testProphet()
    #print(weights_list)

    data = pd.DataFrame(weights_list)
    #print(data)

    model = Prophet()
    model.fit(data)

    prediction = model.make_future_dataframe(periods=30)

    forecast = model.predict(prediction)
    print(forecast)

    fig = px.line(forecast[['ds', 'yhat']], x='ds', y='yhat', title='Pesi')

    #print(fig.to_html())
    return fig.to_html()
    #fig.show()