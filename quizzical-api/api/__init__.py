"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - main configuration file
"""

from flask_restplus import Api
from .courses import api as courses
from .questions import api as questions
from .users import api as users
from .learn import api as learn


api = Api(version='1.0', title='QuizzICAL API',
    description='An API for QuizziCAL Interactive Computer Adaptive Learning',
)

api.add_namespace(courses, path='/courses')
api.add_namespace(questions, path='/questions')
api.add_namespace(users, path='/users')
api.add_namespace(learn, '/learn')
