from enum import Enum
from core.models import User
from flask_jwt_extended import create_access_token

# TODO: Make authentication pluggable

class AuthResult(Enum):
    """
    An enumeration of possible authentication results
    """
    SUCCESS = 0
    USER_NOT_FOUND = 1
    INVALID_CREDENTIALS = 2


def authenticate(email, password):
    """
    Attempts to authenticate a user and returns the authentication result
    and a JWT token on success
    """
    user = User.objects(email=email).first()
    if not user:
        return AuthResult.USER_NOT_FOUND, None
    if not user.verify_password(password):
        return AuthResult.INVALID_CREDENTIALS, None

    token = create_access_token(identity=user.email)
    return AuthResult.SUCCESS, token
