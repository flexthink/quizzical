#pylint: disable=R0201,C0111
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - courses
"""

from flask_restplus import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from core.models import Course, Question
from .data import sort_paginate_params, sort_paginate

api = Namespace('courses', description='Course related operations')

COURSE_MODEL = api.model('Course', {
    'uuid': fields.String(description='A course identifier'),
    'title': fields.String(description='The course title'),
    'summary': fields.String(
        required=True, description='A brief summary of the course'),
    'description': fields.String(
        required=True, description='A detailed course description')
})

QUESTION_SUMMARY_MODEL = api.model('QuestionSummary', {
    'uuid': fields.String(description='A unique question identifier'),
    'question': fields.String(description='The question formulation')
})

@api.route('/')
class CourseListResource(Resource):
    """
    A resource for the course list
    """
    @api.marshal_list_with(COURSE_MODEL)
    @jwt_required
    def get(self):
        """
        Retrieve a course list
        """
        courses = list(Course.objects.all())
        return courses

@api.route('/<course_uuid>')
@api.param('course_uuid', 'The course identifier')
@api.response(200, 'Success')
@api.response(404, 'Course not found')
class CourseResource(Resource):
    """
    A resource for individual courses
    """
    @api.marshal_with(COURSE_MODEL)
    @jwt_required
    def get(self, course_uuid):
        """
        Retrieve a course by ID
        """
        course = Course.objects(uuid=course_uuid).first()
        if not course:
            api.abort(404)
        return course

    @api.expect(COURSE_MODEL, validate=True)
    @jwt_required
    def put(self, course_uuid):
        """
        Upsert the course with the specified ID
        """
        edit_course = Course(**api.payload)
        edit_course.uuid = course_uuid
        edit_course.save()

    def delete(self, course_uuid):
        Course.objects(uuid=course_uuid).delete()


@sort_paginate_params
@api.route('/<course_uuid>/questions/')
class QuestionListResource(Resource):
    """
    A resoruce for question lists
    """
    @api.marshal_list_with(QUESTION_SUMMARY_MODEL)
    @sort_paginate(allow_sort=['question'])
    #@jwt_required
    def get(self, course_uuid):
        """
        Retrieves the list of questions for the course
        """
        return list(Question.objects(course=course_uuid).all())
