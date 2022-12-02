from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint
from flask import Flask, request, jsonify
import configparser
from datetime import datetime
from models import db, Person, Meal, Station, Food, Water, Weight, Beat, Animal
from test_populatedb import populatedb

config = configparser.ConfigParser()
if not config.read('config.ini'):
    print("Please write a config.ini file")
    exit(1)

appname = 'HPMS: Health Pets Monitoring System'
app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=config.get('SQLAlchemy', 'SQLALCHEMY_DATABASE_URI', fallback='sqlite:///db.sqlite')
)

# Initialize db
db.init_app(app)

SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/api/doc'  # Our API url (can of course be a local resource)


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
        return jsonify({'text': appname})
    else:
        return f'<h1>{appname}</h1>'


@app.route('/api/doc')
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


@app.route('/api/users/<username>/stations/<station_id>/animals/<animal_id>/meals', methods=['POST'])
def setMeal(username, station_id, animal_id):
    """
    Set a meal of an animal
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

        -   in: path
            name: animal_id
            description: Animal identification id
            required: true

        -   in: query
            name: meal_type
            description: Type of meal (secco/umido)
            required: true

        -   in: query
            name: quantity
            description: Quantity of meal in grams
            required: true

        -   in: query
            name: time
            description: Time of the meal (example 17:00:00)
            required: true

    responses:
        200:
            description: Sensorfeed id
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    if int(animal_id) not in [animal.id for animal in Station.query.filter_by(id=station_id).first().animals]:
        return "Animal Not Found!", 404

    meal_type = request.args.get('meal_type')
    quantity = request.args.get('quantity')
    time = request.args.get('time')

    if meal_type is None or quantity is None or time is None:
        return "Query Parameters Not Found!", 404

    meal = Meal(meal_type=meal_type, quantity=quantity, time=datetime.strptime(time, '%H:%M:%S'),
                animal_id=animal_id)
    db.session.add(meal)
    db.session.commit()

    return str(meal.id)


@app.route('/api/users/<username>/stations/<station_id>/animals/<animal_id>/meals', methods=['GET'])
def getMeal(username, station_id, animal_id):
    """
    Get meal list of an animal
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

        -   in: path
            name: animal_id
            description: Animal identification id
            required: true

        -   in: query
            name: limit
            description: Limit the list of values
            required: false

    responses:
        200:
            description: Meal list
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    if int(animal_id) not in [animal.id for animal in Station.query.filter_by(id=station_id).first().animals]:
        return "Animal Not Found!", 404

    limit = request.args.get('limit')

    if limit is not None:
        meal = Meal.query.filter_by(animal_id=animal_id).order_by(Meal.id.desc()).limit(int(limit)).all()
    else:
        meal = Meal.query.filter_by(animal_id=animal_id).order_by(Meal.id.desc()).all()

    return [{"id": m.id, "meal_type": m.meal_type, "quantity": m.quantity,
             "time": datetime.strftime(m.time, '%H:%M:%S')} for m in meal]


@app.route('/api/users/<username>/stations/<station_id>/foods', methods=['GET'])
def getFoodLevel(username, station_id):
    """
    Get food level
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

        -   in: query
            name: limit
            description: Limit the list of values
            required: false

    responses:
        200:
            description: List of food level
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    limit = request.args.get('limit')

    if limit is not None:
        foods = Food.query.filter_by(station_id=station_id).order_by(Food.id.desc()).limit(int(limit)).all()
    else:
        foods = Food.query.filter_by(station_id=station_id).order_by(Food.id.desc()).all()

    return jsonify([{"id": f.id, "value": f.value, "timestamp": f.timestamp} for f in foods])


@app.route('/api/users/<username>/stations/<station_id>/waters', methods=['GET'])
def getWaterLevel(username, station_id):
    """
    Get water level
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

        -   in: query
            name: limit
            description: Limit the list of values
            required: false

    responses:
        200:
            description: List of water level
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    limit = request.args.get('limit')

    if limit is not None:
        waters = Water.query.filter_by(station_id=station_id).order_by(Water.id.desc()).limit(int(limit)).all()
    else:
        waters = Water.query.filter_by(station_id=station_id).order_by(Water.id.desc()).all()

    return jsonify([{"id": w.id, "value": w.value, "timestamp": w.timestamp} for w in waters])


@app.route('/api/users/<username>/stations/<station_id>/animals/<animal_id>/weights', methods=['GET'])
def getAnimalWeight(username, station_id, animal_id):
    """
    Get Animal Weight
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

        -   in: path
            name: animal_id
            description: Animal identification id
            required: true

        -   in: query
            name: limit
            description: Limit the list of values
            required: false

    responses:
        200:
            description: List of animal weight
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    if int(animal_id) not in [animal.id for animal in Station.query.filter_by(id=station_id).first().animals]:
        return "Animal Not Found!", 404

    limit = request.args.get('limit')

    if limit is not None:
        weights = Weight.query.filter_by(animal_id=animal_id).order_by(Weight.id.desc()).limit(int(limit)).all()
    else:
        weights = Weight.query.filter_by(animal_id=animal_id).order_by(Weight.id.desc()).all()

    return jsonify([{"id": w.id, "value": w.value, "timestamp": w.timestamp} for w in weights])


@app.route('/api/users/<username>/stations/<station_id>/animals/<animal_id>/beats', methods=['GET'])
def getAnimalBeat(username, station_id, animal_id):
    """
    Get Animal Beat
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

        -   in: path
            name: animal_id
            description: Animal identification id
            required: true

        -   in: query
            name: limit
            description: Limit the list of values
            required: false

    responses:
        200:
            description: List of animal beats
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    if int(animal_id) not in [animal.id for animal in Station.query.filter_by(id=station_id).first().animals]:
        return "Animal Not Found!", 404

    limit = request.args.get('limit')

    if limit is not None:
        beats = Beat.query.filter_by(animal_id=animal_id).order_by(Beat.id.desc()).limit(int(limit)).all()
    else:
        beats = Beat.query.filter_by(animal_id=animal_id).order_by(Beat.id.desc()).all()

    return jsonify([{"id": b.id, "value": b.value, "timestamp": b.timestamp} for b in beats])


@app.route('/api/users/<username>/stations', methods=['GET'])
def getStations(username):
    """
    Return stations of one user
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

    responses:
        200:
            description: List of stations
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    stations = Station.query.filter_by(person_id=Person.query.filter_by(username=username).first().id)\
        .order_by(Station.id.asc()).all()

    return jsonify([{"id": s.id, "latitude": s.latitude, "longitude": s.longitude} for s in stations])


@app.route('/api/users/<username>/stations/<station_id>/animals', methods=['GET'])
def getStationAnimals(username, station_id):
    """
    Return animals of one user and served by an input station
    ---
    parameters:
        -   in: path
            name: username
            description: Username of the User
            required: true

        -   in: path
            name: station_id
            description: Station identification id
            required: true

    responses:
        200:
            description: List of user's animals served by an input station
    """
    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    station_animals = Animal.query.filter_by(station_id=int(station_id)).order_by(Animal.id.asc()).all()

    return jsonify([{"id": sa.id, "name": sa.name, "age": sa.age, "gender": sa.gender,
                     "animal_type": sa.animal_type, "breed": sa.breed,
                     "temperature": sa.temperature, "bark": sa.bark} for sa in station_animals])


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        populatedb(db)    # Only for test

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
