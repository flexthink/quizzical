"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - main launch file
"""

from flask import Flask
from flask_mongoengine import MongoEngine, MongoEngineSessionInterface
from flask_restplus import Api, fields
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from api import api

app = Flask(__name__)
api.init_app(app)

app.config.from_json('config.json')
db = MongoEngine(app)
app.session_interface = MongoEngineSessionInterface(db)
CORS(app, resources={r"/*": {"origins": "*"}}, allow_headers='*', supports_credentials=True)
jwt = JWTManager(app)

app.run(debug=True)
