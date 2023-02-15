from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

# db creation
db = SQLAlchemy()


class Animal(db.Model):
    """
    Digital Twin of an Animal
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    age = db.Column(db.Integer)
    gender = db.Column(db.String(2))
    animal_type = db.Column(db.String(100))
    breed = db.Column(db.String(100))
    temperature = db.Column(db.Integer)
    distance = db.Column(db.Integer)
    bark = db.Column(db.Boolean, default=False)

    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    meals = db.relationship('Meal', cascade='all, delete', backref='animal')
    station_id = db.Column(db.Integer, db.ForeignKey('station.id'), nullable=False)
    weights = db.relationship('Weight', cascade='all, delete', backref='animal')
    beats = db.relationship('Beat', cascade='all, delete', backref='animal')

    def __init__(self, name, age, gender, animal_type, breed, person_id, station_id):
        self.name = name
        self.age = age
        self.gender = gender
        self.animal_type = animal_type
        self.breed = breed
        self.person_id = person_id
        self.station_id = station_id
        

class Meal(db.Model):
    """
    Represent a meal of an animal
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    meal_type = db.Column(db.String(100))
    quantity = db.Column(db.Integer)
    time = db.Column(db.DateTime(timezone=True))

    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)

    def __init__(self, meal_type, quantity, time, animal_id):
        self.meal_type = meal_type
        self.quantity = quantity
        self.time = time
        self.animal_id = animal_id


class Person(db.Model):
    """
    Represent a Person
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    api_key = db.Column(db.String(64), nullable=False)

    animals = db.relationship('Animal', backref='person')
    stations = db.relationship('Station', backref='person')

    def __init__(self, name, username, password, api_key):
        self.name = name
        self.username = username
        self.password = password
        self.api_key = api_key


class Station(db.Model):
    """
    Memorize information about Stations
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)

    animals = db.relationship('Animal', backref='station')
    person_id = db.Column(db.Integer, db.ForeignKey("person.id"), nullable=False)
    waters = db.relationship('Water', backref='station')
    foods = db.relationship('Food', backref='station')

    def __init__(self, latitude, longitude, person_id):
        self.latitude = latitude
        self.longitude = longitude
        self.person_id = person_id


class Weight(db.Model):
    """
    Memorize in db weights of animals
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)

    def __init__(self, value, animal_id):
        self.value = value
        self.animal_id = animal_id


class Water(db.Model):
    """
    Store water level of the Station
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.String(10))
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    station_id = db.Column(db.Integer, db.ForeignKey('station.id'), nullable=False)

    def __init__(self, value, station_id):
        self.value = value
        self.station_id = station_id


class Food(db.Model):
    """
    Store food level of the Station
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.String(10))
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    station_id = db.Column(db.Integer, db.ForeignKey('station.id'), nullable=False)

    def __init__(self, value, station_id):
        self.value = value
        self.station_id = station_id


class Beat(db.Model):
    """
    Store the hearth beat of the animal
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)

    def __init__(self, value, animal_id):
        self.value = value
        self.animal_id = animal_id
