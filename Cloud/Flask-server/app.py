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
