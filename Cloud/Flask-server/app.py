from flask_swagger import swagger
from flask_swagger_ui import get_swaggerui_blueprint
from sqlalchemy_utils.functions import database_exists
from flask import Flask, render_template, request, jsonify
import configparser
from datetime import datetime
from models import db, Person, Animal, Beat, Water, Meal, Station, Food, Weight
from text_populatedb import populatedb

config = configparser.ConfigParser()
if not config.read('config.ini'):
    print("Please write a config.ini file")
    exit(1)

appname = 'Flask Server Trial'
app = Flask(__name__)
app.config.update(
    SQLALCHEMY_DATABASE_URI=config.get('SQLAlchemy', 'SQLALCHEMY_DATABASE_URI', fallback='sqlite:///db.sqlite')
)

# Initialize db
db.init_app(app)

SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/doc'  # Our API url (can of course be a local resource)


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
def text_populatedb():
    return populatedb(db)


@app.route('/users/<username>/stations/<station_id>/animals/<animal_id>/meals', methods=['GET'])
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

    if int(animal_id) not in []:
        return "Animal Not Found!", 404

    meal = Meal.query.filter_by(animal_id=animal_id).all()
    return [{"id": m.id, "meal_type": m.meal_type, "quantity": m.quantity, "data": m.data} for m in meal]


@app.route('/meals/<animal_id>', methods=['POST'])
def setMeal(animal_id):
    """
    Set a meal of an animal
    ---data
    parameters:
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
            name: data
            description: Data of the meal (example 2022-11-29 17:00:00)
            required: true
    responses:
        200:
            description: Sensorfeed id
    """
    meal_type = request.args.get('meal_type')
    quantity = request.args.get('quantity')
    data = request.args.get('data')

    if meal_type is None or quantity is None or data is None:
        return "ERROR"

    meal = Meal(meal_type=meal_type, quantity=quantity, data=datetime.strptime(data, '%Y-%m-%d %H:%M:%S'),
                animal_id=animal_id)
    db.session.add(meal)
    db.session.commit()

    return str(meal.id)


@app.route('/users/<username>/stations/<station_id>/foods', methods=['GET'])
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
    limit = request.args.get('limit')

    if Person.query.filter_by(username=username).first() is None:
        return "User Not Found!", 404

    if int(station_id) not in [station.id for station in Person.query.filter_by(username=username).first().stations]:
        return "Station Not Found!", 404

    if limit is not None:
        foods = Food.query.filter_by(station_id=station_id).order_by(Food.id.desc()).limit(int(limit)).all()
    else:
        foods = Food.query.filter_by(station_id=station_id).all()

    return jsonify([{"id": f.id, "value": f.value, "timestamp": f.timestamp} for f in foods])


@app.route('/')
def getWaterLevel():
    pass


@app.route('/')
def getAnimalWeight():
    pass


@app.route('/')
def getAnimalBeat():
    pass


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
