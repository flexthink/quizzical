#pylint: disable=R0903
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Core - Document definitions
"""

from uuid import UUID
from core.auth_mixin import AuthMixin

from mongoengine import (
    Document, StringField, UUIDField, BooleanField, EmbeddedDocument,
    EmbeddedDocumentListField, DateTimeField, FloatField, DynamicField,
    LazyReferenceField)

class Course(Document):
    """
    Represents a QuizzICAL course
    """
    uuid = UUIDField(primary_key=True)
    title = StringField(max_length=200)
    summary = StringField(max_length=200)
    description = StringField()

class User(Document, AuthMixin):
    """
    Represents a user profile
    """
    uuid = UUIDField(primary_key=True)
    first_name = StringField(max_length=200)
    last_name = StringField(max_length=200)
    email = StringField()
    password_hash = StringField(max_length=128)

class AnswerChoice(EmbeddedDocument):
    """
    Represents an answer to a multiple-choice question
    """
    uuid = UUIDField()
    answer = StringField()
    checked = BooleanField()


class Question(Document):
    """
    Represents a question
    """
    uuid = UUIDField(primary_key=True)
    course = LazyReferenceField(Course)
    level = FloatField(default=0.)
    question = StringField()
    answers = EmbeddedDocumentListField(AnswerChoice)
    multiple = BooleanField()

    def _to_uuid(self, answer):
        return answer if isinstance(answer, UUID) else UUID(answer)

    def _answers_to_set(self, answers):
        if isinstance(answers, str):
            answers = [answers]
        return set(self._to_uuid(answer) for answer in answers)

    def _score_multiple(self, answer):
        """
        Scores a response to this question using Coursera-style scoring (the fraction of checkboxes checked correctly)
        """
        actual_answers = set(answer)
        return 0. if not any(self.answers) else sum(
            float((answer.uuid in actual_answers) == (answer.checked or False))
            for answer in self.answers) / len(self.answers)
    
    def _score_single(self, answer):
        """
        Scores a response based on classic multiple choice model
        with a single correct answer, awarding 1.0 for a correct
        answer and 0.0 for an incorrect one

        :param answer: a single answer or a collection containing
        a single answer
        """
        actual = self._answers_to_set(answer)
        if len(actual) == 1:
            reference = set(
                answer.uuid for answer in self.answers if answer.checked)
            result = actual == reference
        else:
            result = 0.
        return result

    def score(self, answer):
        """
        Scores the answer to a question
        :param answer: a collection of uuids of selected answers 
        (or a single answer)
        """
        return (
            self._score_multiple(answer) if self.multiple
            else self._score_single(answer))


class LearningSession(Document):
    """
    Represents a single learning session
    """
    uuid = UUIDField(primary_key=True)
    course = LazyReferenceField(Course)
    user = LazyReferenceField(User)
    start_time = DateTimeField()
    end_time = DateTimeField()


class Answer(Document):
    """
    Represents an answer a student gave to a question
    """
    uuid = UUIDField(primary_key=True)
    course = LazyReferenceField(Course)
    time = DateTimeField()
    question = LazyReferenceField(Question)
    user = LazyReferenceField(User)
    answer = DynamicField()
    level = FloatField()
    score = FloatField()


class CourseStudentEntry(Document):
    """
    Represents the course statistics for a given student in
    a given course. There should be only one such entry
    per student per course
    """
    uuid = UUIDField(primary_key=True)
    course = LazyReferenceField(Course)
    user = LazyReferenceField(User)
    level = FloatField()
    as_of = DateTimeField()
    last_session = LazyReferenceField(LearningSession)


class CourseStudentSnapshot(Document):
    """
    Represents a snapshot of a student's ability level in a given
    course. Many such snapshots will be created as the user
    advances through the course
    """
    uuid = UUIDField(primary_key=True)
    user = LazyReferenceField(User)
    course = LazyReferenceField(Course)
    as_of = DateTimeField()
    level = FloatField()
    session = LazyReferenceField(LearningSession)
