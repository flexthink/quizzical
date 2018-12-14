#pylint: disable=R0201,C0111,C0103
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - learning
"""

from flask_restplus import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from core.models import Question
from core.learning import (
    LearningEngine, AdaptiveQuestionSource, ItemResponseEstimator,
    Response, Course)
from api.scaffold import guest

api = Namespace('learn', description='Learning operations')

LEARNING_ANSWER_CHOICE_MODEL = api.model('AnswerChoice', {
    'uuid': fields.String(),
    'answer': fields.String()
})

LEARNING_QUESTION_MODEL = api.model('QuestionPrompt', {
    'uuid': fields.String(),
    'question': fields.String(),
    'answers': fields.List(fields.Nested(LEARNING_ANSWER_CHOICE_MODEL)),
    'level': fields.Float()
})

LEARNING_STEP_MODEL = api.model('LearningStep', {
    'session_id': fields.String(), 
    'level': fields.Float(),
    'next_question': fields.Nested(LEARNING_QUESTION_MODEL)
})

response_model = api.model('Response', {
    'question_uuid': fields.String(),
    'response': fields.String()
})


def get_engine(course_uuid) -> LearningEngine:
    """
    Initializes the learning engine
    """
    course = Course.objects.get(uuid=course_uuid)
    user = guest()
    estimator = ItemResponseEstimator(course, user)
    question_source = AdaptiveQuestionSource(course, user)
    return LearningEngine(
        course=course,
        user=guest(),
        question_source=question_source,
        estimator=estimator
    )

@api.route('/course/<course_uuid>/start')
class LearningStart(Resource):
    """
    A resource used to initiate a learning session
    """
    @api.marshal_with(LEARNING_STEP_MODEL)
    def post(self, course_uuid):
        """
        POST handler
        """
        engine = get_engine(course_uuid)
        session = engine.start_or_resume()
        question = engine.next()
        return {'session_id': session.uuid, 'next_question': question}


@api.route('/course/<course_uuid>/submit')
class LearningSubmit(Resource):
    """
    A resource used to submit responses
    """
    @api.marshal_with(LEARNING_STEP_MODEL)
    @api.expect(response_model)
    def post(self, course_uuid):
        """
        POST handler
        """
        question = Question.objects.get(uuid=api.payload['question_uuid'])
        if not question:
            api.abort(404)
        response = Response(question, api.payload['answer'])
        engine = get_engine(course_uuid)
        session = engine.start_or_resume()
        result = engine.submit(response)
        next_question = engine.next()
        return {
            'session_id': session.uuid,
            'next_question': next_question,
            'level': result.level}
