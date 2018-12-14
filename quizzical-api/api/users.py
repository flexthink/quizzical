#pylint: disable=R0201,C0111 Flask-RESTPlus conventions
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

API - users
"""

from flask import jsonify
from flask_restplus import Namespace, Resource, fields
from flask_jwt_extended import jwt_required
from core.models import User
from api.auth import authenticate, AuthResult
from .data import sort_paginate_params, sort_paginate


api = Namespace('users', description='User related operations')


USER_MODEL = api.model('User', {
    'uuid': fields.String('A unique student identifier'),
    'first_name': fields.String("The student's first name", required=True),
    'last_name': fields.String("The student's last name", required=True),
    'email': fields.String("The student's email address", required=True),
    'password': fields.String("The user's password")
})


AUTHENTICATION_REQUEST_MODEL = api.model(
    'AuthenticationRequest', {
        'email': fields.String("The user's email", required=True),
        'password': fields.String("The user's password", required=True)
})


@api.route('/')
@sort_paginate_params(api)
class UserListResource(Resource):
    """
    A resource for the student list
    """
    @api.marshal_list_with(USER_MODEL)
    @sort_paginate(allow_sort=['first_name', 'last_name', 'email'])
    def get(self):
        """
        Retrieves a list of users
        """
        return User.objects


@api.route('/<user_id>')
class UserResource(Resource):
    """
    A resource for retrieving individual students
    """
    @api.marshal_with(USER_MODEL)
    def get(self, user_id):
        """
        GET handeler
        """
        return User.objects(uuid=user_id).first()

    @api.expect(USER_MODEL, validate=True)
    def put(self, user_id):
        """
        PUT handler
        """
        edit_user = User(**api.payload)
        edit_user.uuid = user_id
        edit_user.save()

    def delete(self, user_id):
        """
        DELETE handler
        """
        User.objects(uuid=user_id).delete()


MESSAGES = {
    AuthResult.INVALID_CREDENTIALS: "Invalid credentials",
    AuthResult.USER_NOT_FOUND: "User not found",
}


@api.route('/authenticate')
class AuthenticateResource(Resource):
    """
    A resource for user authentication
    """
    @api.expect(AUTHENTICATION_REQUEST_MODEL, validate=True)
    def post(self):
        """
        POST handler
        """
        request = api.payload
        result, token = authenticate(
            email=request.get('email'),
            password=request.get('password'))
        if result == AuthResult.SUCCESS:
            result = jsonify({"token": token})
        else:
            result = MESSAGES[result], 401
        return result
