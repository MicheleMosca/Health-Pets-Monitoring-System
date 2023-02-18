import sqlalchemy.exc
from models import Person, Animal, Station, Meal, Food, Water, Weight, Beat
from datetime import datetime
import secrets

def populatedb(db):
    """
    Populate db, only for test!
    """
    try:
        user_1 = Person(name='Michele', username='michele', password='password', api_key=secrets.token_urlsafe(64))
        db.session.add(user_1)
        db.session.commit()
    except sqlalchemy.exc.IntegrityError:
        return

    user_2 = Person(name='Elme', username='elme', password='password', api_key=secrets.token_urlsafe(64))
    db.session.add(user_2)
    db.session.commit()

    user_3 = Person(name='Giuseppe', username='beppe', password='password', api_key=secrets.token_urlsafe(64))
    db.session.add(user_3)
    db.session.commit()

    user_4 = Person(name='Gaetano', username='tano', password='password', api_key=secrets.token_urlsafe(64))
    db.session.add(user_4)
    db.session.commit()

    station_1 = Station(latitude=44.63099, longitude=10.94709, address="66, Via Giorgio Bartolomasi, Punta, Buon Pastore-Sant'Agnese-San Damaso, Modena, Emilia-Romagna, 41125, Italia", person_id=user_1.id)
    db.session.add(station_1)
    db.session.commit()

    station_2 = Station(latitude=44.63164, longitude=10.94739, address="15, Via Barbato Zanoni, Punta, Buon Pastore-Sant'Agnese-San Damaso, Modena, Emilia-Romagna, 41125, Italia", person_id=user_2.id)
    db.session.add(station_2)
    db.session.commit()

    station_3 = Station(latitude=44.63057, longitude=10.95168, address="48, Via Aurelio Saffi, Punta, Buon Pastore-Sant'Agnese-San Damaso, Modena, Emilia-Romagna, 41125, Italia", person_id=user_3.id)
    db.session.add(station_3)
    db.session.commit()

    station_4 = Station(latitude=44.63075, longitude=10.94859, address="94, Via Barbato Zanoni, Punta, Buon Pastore-Sant'Agnese-San Damaso, Modena, Emilia-Romagna, 41125, Italia", person_id=user_4.id)
    db.session.add(station_4)
    db.session.commit()

    animal_1 = Animal(name='Pluto', age=2, gender='M', animal_type='dog',
                   breed='alano', person_id=user_1.id, station_id=station_1.id)
    animal_1.temperature = 36
    animal_1.bark = True
    db.session.add(animal_1)
    db.session.commit()

    animal_2 = Animal(name='agnelli', age=5, gender='M', animal_type='dog',
                      breed='beagle', person_id=user_2.id, station_id=station_2.id)
    animal_2.temperature = 36
    animal_2.bark = True
    db.session.add(animal_2)
    db.session.commit()

    animal_3 = Animal(name='sofia', age=12, gender='F', animal_type='dog',
                      breed='bassotto', person_id=user_3.id, station_id=station_3.id)
    animal_3.temperature = 36
    animal_3.bark = True
    db.session.add(animal_3)
    db.session.commit()

    animal_4 = Animal(name='carletto', age=1, gender='M', animal_type='dog',
                      breed='carlino', person_id=user_4.id, station_id=station_4.id)
    animal_4.temperature = 36
    animal_4.bark = True
    db.session.add(animal_4)
    db.session.commit()

    animal_5 = Animal(name='bartolomeo', age=13, gender='M', animal_type='dog',
                      breed='cane da pastore', person_id=user_3.id, station_id=station_3.id)
    animal_5.temperature = 36
    animal_5.bark = True
    db.session.add(animal_5)
    db.session.commit()

    animal_6 = Animal(name='rebecca', age=4, gender='F', animal_type='cat',
                      breed='balinese', person_id=user_3.id, station_id=station_3.id)
    animal_6.temperature = 36
    animal_6.bark = False
    db.session.add(animal_6)
    db.session.commit()

    animal_7 = Animal(name='rex', age=8, gender='M', animal_type='dog',
                      breed='beagle', person_id=user_2.id, station_id=station_2.id)
    animal_7.temperature = 36
    db.session.add(animal_7)
    db.session.commit()

    animal_8 = Animal(name='Alice', age=1, gender='F', animal_type='cat',
                      breed='persiano', person_id=user_1.id, station_id=station_1.id)
    animal_8.temperature = 36
    db.session.add(animal_8)
    db.session.commit()

    animal_9 = Animal(name='pelliccia', age=2, gender='F', animal_type='cat',
                      breed='egyptian mau', person_id=user_2.id, station_id=station_2.id)
    animal_9.temperature = 36
    db.session.add(animal_9)
    db.session.commit()

    animal_10 = Animal(name='mao', age=7, gender='F', animal_type='cat',
                      breed='bengala', person_id=user_4.id, station_id=station_4.id)
    animal_10.temperature = 36
    db.session.add(animal_10)
    db.session.commit()

    meal_1 = Meal(meal_type='secco', quantity=100, time=datetime.strptime('8:00:00', '%H:%M:%S'), animal_id=animal_1.id)
    db.session.add(meal_1)
    db.session.commit()

    meal_2 = Meal(meal_type='secco', quantity=200, time=datetime.strptime('13:15:00', '%H:%M:%S'), animal_id=animal_1.id)
    db.session.add(meal_2)
    db.session.commit()

    meal_3 = Meal(meal_type='umido', quantity=100, time=datetime.strptime('19:30:00', '%H:%M:%S'), animal_id=animal_1.id)
    db.session.add(meal_3)
    db.session.commit()

    food_1 = Food(value='high', station_id=station_1.id, timestamp=datetime.strptime('15/02/2023 19:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_1)
    db.session.commit()

    food_2 = Food(value='high', station_id=station_1.id, timestamp=datetime.strptime('15/02/2023 23:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_2)
    db.session.commit()

    food_3 = Food(value='low', station_id=station_1.id,  timestamp=datetime.strptime('16/02/2023 09:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_3)
    db.session.commit()

    food_4 = Food(value='low', station_id=station_1.id,  timestamp=datetime.strptime('16/02/2023 11:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_4)
    db.session.commit()

    food_5 = Food(value='high', station_id=station_1.id,  timestamp=datetime.strptime('16/02/2023 14:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_5)
    db.session.commit()

    food_6 = Food(value='low', station_id=station_1.id,  timestamp=datetime.strptime('16/02/2023 17:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_6)
    db.session.commit()

    food_7 = Food(value='high', station_id=station_1.id,  timestamp=datetime.strptime('16/02/2023 19:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_6)
    db.session.commit()

    food_8 = Food(value='medium', station_id=station_1.id,  timestamp=datetime.strptime('16/02/2023 21:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(food_6)
    db.session.commit()

    water_1 = Water(value='high', station_id=station_1.id, timestamp=datetime.strptime('15/02/2023 19:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_1)
    db.session.commit()

    water_2 = Water(value='high', station_id=station_1.id, timestamp=datetime.strptime('15/02/2023 23:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_2)
    db.session.commit()

    water_3 = Water(value='medium', station_id=station_1.id, timestamp=datetime.strptime('16/02/2023 03:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_3)
    db.session.commit()

    water_4 = Water(value='low', station_id=station_1.id, timestamp=datetime.strptime('16/02/2023 07:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_4)
    db.session.commit()

    water_5 = Water(value='high', station_id=station_1.id, timestamp=datetime.strptime('16/02/2023 10:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_5)
    db.session.commit()

    water_6 = Water(value='medium', station_id=station_1.id, timestamp=datetime.strptime('16/02/2023 13:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_6)
    db.session.commit()

    water_7 = Water(value='low', station_id=station_1.id, timestamp=datetime.strptime('16/02/2023 15:30:00', '%d/%m/%Y %H:%M:%S'))
    db.session.add(water_7)
    db.session.commit()

    weight_1 = Weight(value=4, animal_id=animal_1.id)
    db.session.add(weight_1)
    db.session.commit()

    weight_2 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_2)
    db.session.commit()

    weight_3 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_3)
    db.session.commit()

    weight_4 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_4)
    db.session.commit()

    weight_5 = Weight(value=4, animal_id=animal_1.id)
    db.session.add(weight_5)
    db.session.commit()

    weight_6 = Weight(value=4, animal_id=animal_1.id)
    db.session.add(weight_6)
    db.session.commit()

    weight_7 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_7)
    db.session.commit()

    weight_8 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_8)
    db.session.commit()

    weight_9 = Weight(value=6, animal_id=animal_1.id)
    db.session.add(weight_9)
    db.session.commit()

    weight_10 = Weight(value=6, animal_id=animal_1.id)
    db.session.add(weight_10)
    db.session.commit()

    weight_11 = Weight(value=6, animal_id=animal_1.id)
    db.session.add(weight_11)
    db.session.commit()

    weight_12 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_12)
    db.session.commit()

    weight_13 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_13)
    db.session.commit()

    weight_14 = Weight(value=6, animal_id=animal_1.id)
    db.session.add(weight_14)
    db.session.commit()

    weight_15 = Weight(value=7, animal_id=animal_1.id)
    db.session.add(weight_15)
    db.session.commit()

    weight_16 = Weight(value=7, animal_id=animal_1.id)
    db.session.add(weight_16)
    db.session.commit()

    weight_17 = Weight(value=8, animal_id=animal_1.id)
    db.session.add(weight_17)
    db.session.commit()

    weight_18 = Weight(value=8, animal_id=animal_1.id)
    db.session.add(weight_18)
    db.session.commit()

    weight_19 = Weight(value=9, animal_id=animal_1.id)
    db.session.add(weight_19)
    db.session.commit()

    weight_20 = Weight(value=9, animal_id=animal_1.id)
    db.session.add(weight_20)
    db.session.commit()

    weight_21 = Weight(value=9, animal_id=animal_1.id)
    db.session.add(weight_21)
    db.session.commit()

    weight_22 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_22)
    db.session.commit()

    weight_23 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_23)
    db.session.commit()

    weight_24 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_24)
    db.session.commit()

    weight_25 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_25)
    db.session.commit()

    weight_26 = Weight(value=9, animal_id=animal_1.id)
    db.session.add(weight_26)
    db.session.commit()

    weight_27 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_27)
    db.session.commit()

    weight_28 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_28)
    db.session.commit()

    weight_29 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_29)
    db.session.commit()

    weight_30 = Weight(value=10, animal_id=animal_1.id)
    db.session.add(weight_30)
    db.session.commit()

    beats_1 = Beat(value=120, animal_id=animal_1.id)
    db.session.add(beats_1)
    db.session.commit()

    beats_2 = Beat(value=110, animal_id=animal_1.id)
    db.session.add(beats_2)
    db.session.commit()

    beats_3 = Beat(value=90, animal_id=animal_2.id)
    db.session.add(beats_3)
    db.session.commit()

    beats_4 = Beat(value=100, animal_id=animal_3.id)
    db.session.add(beats_4)
    db.session.commit()

    beats_5 = Beat(value=50, animal_id=animal_4.id)
    db.session.add(beats_5)
    db.session.commit()

    beats_6 = Beat(value=110, animal_id=animal_5.id)
    db.session.add(beats_6)
    db.session.commit()

    beats_7 = Beat(value=70, animal_id=animal_6.id)
    db.session.add(beats_7)
    db.session.commit()

    beats_8 = Beat(value=150, animal_id=animal_7.id)
    db.session.add(beats_8)
    db.session.commit()

    beats_9 = Beat(value=120, animal_id=animal_8.id)
    db.session.add(beats_9)
    db.session.commit()

    return str(user_1.id)
