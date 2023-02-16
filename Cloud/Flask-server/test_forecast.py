import pandas as pd
import random

def testProphet():
    dates = pd.date_range(start=pd.Timestamp.now(), end='31/12/2023')
    w = []

    for d in dates:
        dictionary = {'ds': d, 'y': round(random.uniform(4.0, 9.0), 4)}
        w.append(dictionary)

    return w