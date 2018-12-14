from unittest import TestCase
from mongoengine import connect


class TestBase(TestCase):
    def setUp(self):
        connect('quizzical', host='mongomock://localhost')