from models import Person, Animal, Station, Meal, Food, Water, Weight, Beat
from datetime import datetime


def populatedb(db):
    """
    Populate db, only for test!
    ---
    responses:
        200:
            description: id
    """
    user_1 = Person(name='Michele', username='michele', password='password')
    db.session.add(user_1)
    db.session.commit()

    user_2 = Person(name='Elme', username='elme', password='password')
    db.session.add(user_2)
    db.session.commit()

    user_3 = Person(name='Giuseppe', username='beppe', password='password')
    db.session.add(user_3)
    db.session.commit()

    user_4 = Person(name='Gaetano', username='tano', password='password')
    db.session.add(user_4)
    db.session.commit()

    station_1 = Station(latitude=44.63890, longitude=10.94452, person_id=user_1.id)
    db.session.add(station_1)
    db.session.commit()

    station_2 = Station(latitude=50.63890, longitude=10.94452, person_id=user_2.id)
    db.session.add(station_2)
    db.session.commit()

    station_3 = Station(latitude=44.63890, longitude=50.94452, person_id=user_3.id)
    db.session.add(station_3)
    db.session.commit()

    station_4 = Station(latitude=14.63890, longitude=10.94452, person_id=user_4.id)
    db.session.add(station_4)
    db.session.commit()

    animal_1 = Animal(name='pippo', age=2, gender='M', animal_type='dog',
                   breed='alano', person_id=user_1.id, station_id=station_1.id)
    db.session.add(animal_1)
    db.session.commit()

    animal_2 = Animal(name='agnelli', age=5, gender='M', animal_type='dog',
                      breed='beagle', person_id=user_2.id, station_id=station_2.id)
    db.session.add(animal_2)
    db.session.commit()

    animal_3 = Animal(name='sofia', age=12, gender='F', animal_type='dog',
                      breed='bassotto', person_id=user_3.id, station_id=station_3.id)
    db.session.add(animal_3)
    db.session.commit()

    animal_4 = Animal(name='carletto', age=1, gender='M', animal_type='dog',
                      breed='carlino', person_id=user_4.id, station_id=station_4.id)
    db.session.add(animal_4)
    db.session.commit()

    animal_5 = Animal(name='bartolomeo', age=13, gender='M', animal_type='dog',
                      breed='cane da pastore', person_id=user_3.id, station_id=station_3.id)
    db.session.add(animal_5)
    db.session.commit()

    animal_6 = Animal(name='rebecca', age=4, gender='F', animal_type='cat',
                      breed='balinese', person_id=user_3.id, station_id=station_3.id)
    db.session.add(animal_6)
    db.session.commit()

    animal_7 = Animal(name='rex', age=8, gender='M', animal_type='dog',
                      breed='beagle', person_id=user_1.id, station_id=station_1.id)
    db.session.add(animal_7)
    db.session.commit()

    animal_8 = Animal(name='alice', age=1, gender='F', animal_type='cat',
                      breed='persiano', person_id=user_2.id, station_id=station_2.id)
    db.session.add(animal_8)
    db.session.commit()

    animal_9 = Animal(name='pelliccia', age=2, gender='F', animal_type='cat',
                      breed='egyptian mau', person_id=user_2.id, station_id=station_2.id)
    db.session.add(animal_9)

    animal_10 = Animal(name='mao', age=7, gender='F', animal_type='cat',
                      breed='bengala', person_id=user_4.id, station_id=station_4.id)
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

    food_1 = Food(value='high', station_id=station_1.id)
    db.session.add(food_1)
    db.session.commit()

    food_2 = Food(value='medium', station_id=station_1.id)
    db.session.add(food_2)
    db.session.commit()

    water_1 = Water(value='medium', station_id=station_1.id)
    db.session.add(water_1)
    db.session.commit()

    water_2 = Water(value='high', station_id=station_1.id)
    db.session.add(water_2)
    db.session.commit()

    weight_1 = Weight(value=4, animal_id=animal_1.id)
    db.session.add(weight_1)
    db.session.commit()

    weight_2 = Weight(value=5, animal_id=animal_1.id)
    db.session.add(weight_2)
    db.session.commit()

    beats_1 = Beat(value=120, animal_id=animal_1.id)
    db.session.add(beats_1)
    db.session.commit()

    beats_2 = Beat(value=110, animal_id=animal_1.id)
    db.session.add(beats_2)
    db.session.commit()

    return str(user_1.id)
