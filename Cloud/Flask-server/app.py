from flask_sqlalchemy import SQLAlchemy
from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint
from sqlalchemy_utils.functions import database_exists
from flask import Flask, render_template, request, jsonify
import configparser
from datetime import datetime

config = configparser.ConfigParser()
if not config.read('config.ini'):
    print("Please write a config.ini file")
    exit(1)

appname = 'Flask Server Trial'
app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=config.get('SQLAlchemy', 'SQLALCHEMY_DATABASE_URI', fallback='sqlite:///db.sqlite')
)

# db creation
db = SQLAlchemy(app)

SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/doc'  # Our API url (can of course be a local resource)


class Sensorfeed(db.Model):
    """
    Memorize in db the Sensor Feed, described by an id, value and timestamp
    """
    id = db.Column('value_id', db.Integer, primary_key=True)
    value = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    def __init__(self, value):
        self.value = value


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
    bark = db.Column(db.Boolean)

    person_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    meals = db.relationship('Meal', backref='animal')
    station_id = db.Column(db.Integer, db.ForeignKey('station.id'), nullable=False)
    weights = db.relationship('Weight', backref='animal')
    beats = db.relationship('Beat', backref='animal')

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
    data = db.Column(db.DateTime(timezone=True))

    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)

    def __init__(self, meal_type, quantity, data):
        self.meal_type = meal_type
        self.quantity = quantity
        self.data = data


class Person(db.Model):
    """
    Represent a Person
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100))
    username = db.Column(db.String(100))
    password = db.Column(db.String(100))

    animals = db.relationship('Animal', backref='person')
    stations = db.relationship('Station', backref='person')

    def __init__(self, name, username, password):
        self.name = name
        self.username = username
        self.password = password


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

    # def __init__(self, latitude, longitude, person_id):
    #     self.latitude = latitude
    #     self.longitude = longitude
    #     self.person_id = person_id


class Weight(db.Model):
    """
    Memorize in db weights of animals
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)

    def __init__(self, value):
        self.value = value


class Water(db.Model):
    """
    Memorize in db water level of the Station
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    station_id = db.Column(db.Integer, db.ForeignKey('station.id'), nullable=False)

    def __init__(self, value):
        self.value = value


class Food(db.Model):
    """
    Memorize in db food level of the Station
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    station_id = db.Column(db.Integer, db.ForeignKey('station.id'), nullable=False)

    def __init__(self, value):
        self.value = value


class Beat(db.Model):
    """
    Memorize in db the hearth beat of the animal
    """
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    value = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime(timezone=True), nullable=False, default=datetime.utcnow)

    animal_id = db.Column(db.Integer, db.ForeignKey('animal.id'), nullable=False)

    def __init__(self, value):
        self.value = value


@app.route('/sensor', methods=['GET'])
def getSensorValue():
    """
    Get sensor values
    ---
    parameters:
        -   in: query
            name: limit
            description: Limit the list of values
            required: false
    responses:
      200:
        description: List of values
    """
    limit = request.args.get('limit')

    if limit is not None:
        # Query to get limit sensor feed ordered by id in desc order
        sensorfeed = Sensorfeed.query.order_by(Sensorfeed.id.desc()).limit(int(limit)).all()
    else:
        # Query to get all sensor feed ordered by id in desc order
        sensorfeed = Sensorfeed.query.order_by(Sensorfeed.id.desc()).all()

    return render_template('sensor.html', sensorfeed=sensorfeed)


@app.errorhandler(404)
def pageNotFound(error):
    """
    Function to renderer 404 page
    ---
    responses:
        404:
            description: Errors
    """
    return f'<h1>Page Not Found!</h1><br><p>{error}</p>', 404


@app.route('/')
def index():
    """
    Index page of the site
    ---
    responses:
        200:
            description: Text
    """
    if request.accept_mimetypes['application/json']:
        return jsonify({'text': 'Flask Server Trial'})
    else:
        return '<h1>Flask Server Trial</h1>'


@app.route('/sensor/<data>', methods=['POST'])
def setSensorValue(data):
    """
    Update the value of the sensor
    ---
    parameters:
        -   in: path
            name: data
            description: Actual value of the sensor
            required: true
    responses:
        200:
            description: Sensorfeed id
    """
    sensorfeed = Sensorfeed(data)

    db.session.add(sensorfeed)
    db.session.commit()

    return str(sensorfeed.id)


@app.route('/doc')
def doc():
    """
    Swagger documentation
    ---
    responses:
        200:
            description: Swagger Documentation in json format
    """
    swag = swagger(app)
    swag['info']['version'] = '1.0'
    swag['info']['title'] = appname

    return jsonify(swag)


@app.route('/populatedb')
def populatedb():
    utente1 = Person(name='Michele', username='michele1', password='password')
    db.session.add(utente1)
    db.session.commit()

    station_1 = Station(latitude='', longitude='')
    return str(utente1.id)


if __name__ == '__main__':
    # If sqlite db is not created, now will create it
    if not database_exists(app.config['SQLALCHEMY_DATABASE_URI']):
        with app.app_context():
            db.create_all()

    # Call factory function to create our blueprint
    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,  # Swagger UI static files will be mapped to '{SWAGGER_URL}/dist/'
        API_URL,
        config={  # Swagger UI config overrides
            'app_name': appname
        }
    )
    app.register_blueprint(swaggerui_blueprint)

    # Run app with configuration
    app.run(host=config.get('Flask', 'FLASK_RUN_HOST', fallback='0.0.0.0'),
            port=config.get('Flask', 'FLASK_RUN_PORT', fallback=80))
