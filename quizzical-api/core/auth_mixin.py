from passlib.apps import custom_app_context as pwd_context


"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Core - Authentication
"""

class AuthMixin:
    """
    A mixin for authentication
    """
    @property
    def password(self):
        """
        A convenience property to set the password. The password will still 
        be hashed, and the plain-text
        password will be discarded. The property always returns None when read
        """
        return None

    @password.setter
    def password(self, value):
        self.hash_password(value)

    def hash_password(self, password):
        """
        Saves a hash of the specified password
        :param password: the plain-text password
        """
        self.password_hash = pwd_context.encrypt(password)

    def verify_password(self, password):
        """
        Verifies the provided plain-text password
        against the stored hash

        :param password: the plain-text password
        """
        return pwd_context.verify(password, self.password_hash)
