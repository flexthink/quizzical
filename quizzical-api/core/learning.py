#pylint: disable=R0903
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Core - Learning engine implementation
"""

from datetime import datetime
from uuid import uuid4

import abc
import numpy as np

from core.models import (Question, User, LearningSession, Answer, Course,
                         CourseStudentSnapshot, CourseStudentEntry)
from core.itemresponse import estimate_level


class QuestionSource:
    """
    Represents a question source
    """
    @abc.abstractmethod
    def get_question(self) -> Question:
        """
        Returns the next question to be shown to the user as part of a
        learning exercise
        """
        pass


class Estimator:
    """
    Represents a mechanism for estimating student performance
    """
    @abc.abstractmethod
    def estimate_level(self):
        """
        Produces the estimate of a student's level
        """
        pass


class DummyEstimator(Estimator):
    """
    An estimator implementation that always returns the specified value
    """
    def __init__(self, value=0.0):
        self.value = value

    def estimate_level(self):
        """
        Produces a dummy estimate of a user's level
        """
        return self.value


class ItemResponseEstimator(Estimator):
    """
    A learning estimator implementation based on Item Response Theory
    """
    def __init__(self, course: Course, user: User, horizon=None):
        """
        Class constructor
        :param course: the course for which estimation is being performed
        :param horizon: the number of questions used in the estimation. If
        no horizon is provided, the entire interval will be used
        """
        self.course = course
        self.user = user
        self.horizon = horizon

    def _get_answers(self):
        answers = Answer.objects(course=self.course, user=self.user)
        if self.horizon:
            result = answers.order_by('-time')[:self.horizon]
        else:
            result = answers.all()
        return result

    def estimate_level(self):
        """
        Estimates the student's ability level using Item Response Theory maximum
        likelihood estimation
        """
        answers = [(answer.level, answer.score) for answer in self._get_answers()]
        items = np.array(answers).T
        return estimate_level(items)


class RandomQuestionSource(QuestionSource):
    """
    Represents a random of questions for learning
    """
    def __init__(self, course):
        """
        Class constructor
        :param course: the course from which questions will be selected
        """
        self.course = course

    def get_question(self):
        """
        Selects a question at random
        """
        sample = {'$sample': {'size': 1}}
        result = Question.objects(course=self.course).aggregate(sample)
        document = next(result, None)
        return Question.objects.get(uuid=document['_id']) if document else None


class AdaptiveQuestionSource(QuestionSource):
    """
    A question source that will adapt to the student's level of ability
    """
    def __init__(self, course: Course, user: User):
        """
        Class constructor
        :param course: the course from which questions will be selected
        :param user: the user for whom questions will be selected
        """
        self.course = course
        self.user = user
        self.level = None

    def _fetch_level(self):
        entry = CourseStudentEntry.objects(user=self.user).first()
        self.level = entry.level if entry else 0.

    def get_question(self):
        """
        Selects the closest question to the student's current ability level
        """
        if not self.level:
            self._fetch_level()
        # TODO: Avoid repetition
        question = Question.objects(course=self.course, level__gte=self.level).order_by('level').first()
        if not question:
            question = Question.objects.order_by('-level').first()
        return question


class Response:
    """
    Represents a response to a question
    """
    def __init__(self, question, answer):
        self.question = question
        self.answer = answer


class LearningEngine:
    """
    The Learning Engine is responsible for integrating the input from
    a student's interactions with QuizzICAL, suggesting the next question
    and updating statistics
    """
    def __init__(self, course: Course, user: User,
                 question_source: QuestionSource = None,
                 estimator: Estimator = None):
        self.course = course
        self.user = user
        self.question_source = question_source or RandomQuestionSource(self.course)
        self.estimator = estimator or DummyEstimator()
        self.session = None


    def _get_active_session(self):
        return LearningSession.objects(course=self.course, end_time=None).first()

    def _assert_active_session(self):
        if not self.session:
            raise ValueError("There is no active learning session")


    def start(self) -> LearningSession:
        """
        Starts a new learning session
        """
        session = LearningSession(
            uuid=uuid4(),
            user=self.user,
            course=self.course,
            start_time=datetime.now()
        )
        self.session = session
        session.save()
        return session

    def resume(self) -> LearningSession:
        """
        Resumes an active learning session, if there is one.
        """
        self.session = self._get_active_session()
        return self.session

    def start_or_resume(self):
        """
        Resumes an active session if there is one in progress,
        starts a new session otherwise.
        """
        session = self.resume()
        if not self.session:
            session = self.start()
        self.session = session
        return self.session

    def next(self) -> Question:
        """
        Retrieves the next question to be answered
        """
        self._assert_active_session()
        return self.question_source.get_question()

    def submit(self, response: Response):
        """
        Submits an answer to a question and updates learning statistics
        :param response: the response
        """
        self._assert_active_session()
        self._save_answer(response)
        level = self.estimator.estimate_level()
        print(f"LEVEL = {level}")
        now = datetime.now()
        self._save_snapshot(level, now)
        return self._save_course_entry(level, now)

    def _save_answer(self, response: Response):
        answer_entry = Answer(
            uuid=uuid4(),
            user=self.user,
            course=self.course,
            question=response.question,
            level=response.question.level,
            answer=response.answer,
            score=response.question.score(response.answer)
        )
        answer_entry.save()
        return answer_entry

    def _save_snapshot(self, level, as_of):
        snapshot = CourseStudentSnapshot(
            uuid=uuid4(),
            course=self.course,
            user=self.user,
            as_of=as_of,
            level=level
        )
        snapshot.save()
        return snapshot

    def _save_course_entry(self, level, as_of):
        course_entry = CourseStudentEntry.objects(
            course=self.course, user=self.user).first()
        if not course_entry:
            course_entry = CourseStudentEntry(
                uuid=uuid4(),
                course=self.course,
                user=self.user,
                as_of=as_of
            )
        course_entry.level = level
        course_entry.last_session = self.session
        course_entry.save()
        return course_entry
        