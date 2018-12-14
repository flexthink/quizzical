#pylint: disable=R0201,C0111,C0103
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - questions
"""

from flask_restplus import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from core.models import Question

api = Namespace('questions', description='Question related operations')

ANSWER_MODEL = api.model('MultipleChoiceAnswer', {
    'uuid': fields.String(),
    'answer': fields.String(),
    'checked': fields.Boolean(default=False)
})

QUESTION_MODEL = api.model('Question', {
    'uuid': fields.String(description='A unique question identifier'),
    'question': fields.String(required=True, description='A detailed question formulation'),
    'course': fields.String(required=True, description='The UUID of the course to which this question belongs'),
    'answers': fields.List(fields.Nested(ANSWER_MODEL))
})

@api.route('/<question_uuid>')
class QuestionResource(Resource):
    """
    A resource for individual questions
    """
    @api.marshal_with(QUESTION_MODEL)
    @jwt_required
    def get(self, question_uuid):
        """
        GET handler
        """
        return Question.objects(uuid=question_uuid).first()

    @api.expect(QUESTION_MODEL, validate=True)
    @jwt_required
    def put(self, question_uuid):
        """
        PUT handler
        """
        edit_question = Question(**api.payload)
        edit_question.uuid = question_uuid
        edit_question.save()

    @jwt_required
    def delete(self, question_uuid):
        """
        DELETE handler
        """
        Question.objects(uuid=question_uuid).delete()
