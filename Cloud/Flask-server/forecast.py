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
    data_dict = forecast[['ds', 'yhat']].to_dict()
    #print(data_dict['ds'].keys())
    data_list = []

    for key in data_dict['ds'].keys():
        data_list.append({"x": data_dict['ds'][key], "y": data_dict['yhat'][key]})

    #print(data_list)

    return data_list