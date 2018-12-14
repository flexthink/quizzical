from uuid import uuid4

from tests import TestBase
from core.models import User
from api.auth import authenticate, AuthResult
from unittest.mock import patch

@patch('flask_jwt_extended.create_access_token', return_value='bogus_token')
class AuthenticationTests(TestBase):
    """
    Tests for authentication
    """
    def setUp(self):
        super().setUp()
        User.objects.delete()
        user = User(
            uuid=uuid4(),
            first_name='Chuck',
            last_name='Norris',
            email='cnorris@test.com'
        )
        user.password = 'roundhouse32' # It will be hashed
        user.save()

    def test_authenticate_success(self, *args):
        """
        Test for successful authentication
        """
        result, token = authenticate('cnorris@test.com', 'roundhouse32')
        self.assertEqual(AuthResult.SUCCESS, result)
        self.assertIsNotNone(token)

    def test_authenticate_user_not_found(self, *args):
        """
        Test for attempting to authenticate with a non-existent user name
        """
        result, token = authenticate('santa@test.com', 'rudolph')
        self.assertEqual(AuthResult.USER_NOT_FOUND, result)
        self.assertIsNone(token)

    def test_authenticate_bad_password(self, *args):
        """
        Test for attempting to authenticate with an invalid password
        """
        result, token = authenticate('cnorris@test.com', 'iforgot')
        self.assertEqual(AuthResult.INVALID_CREDENTIALS, result)
        self.assertIsNone(token)