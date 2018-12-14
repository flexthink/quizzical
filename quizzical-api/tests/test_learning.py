"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Learning engine tests
"""

from datetime import datetime
from uuid import uuid4, UUID

from core.models import (
    Question, Course, User, LearningSession, CourseStudentEntry,
    CourseStudentSnapshot)
from core.learning import (
    RandomQuestionSource, DummyEstimator, LearningEngine, Response)

from tests import TestBase

def dummy_course():
    """
    Creates a dummy course
    """
    return Course(
        uuid='805acb1c-739c-4f4a-a529-3027c95f8c60',
        title='Arithmetic')

def dummy_questions(course: Course):
    """
    Creates a collection of dummy questions
    :param course: The course for which the questions will be generated
    """
    return [
        Question(
            uuid='50e46980-6c4e-450c-853e-efca2357a23a',
            course=course,
            question='2 + 2 ='
        ),
        Question(
            uuid='29f47817-350f-4893-9372-50db5185618c',
            course=course,
            question='3 + 3 ='
        ),
        Question(
            uuid='29f47817-350f-4893-9372-50db5185618c',
            course=course,
            question='4 + 4 ='
        )
    ]

class RandomQuestionSourceTests(TestBase):
    """
    Unit tests for RandomQuestionSource
    """
    def test_get_question(self):
        """
        Test for get_question()
        """
        course = dummy_course()
        questions = dummy_questions(course)
        for question in questions:
            question.save()

        question_source = RandomQuestionSource(course)
        question = question_source.get_question()
        self.assertIsNotNone(question)
        self.assertIsNotNone(question.question)
        self.assertEqual(
            '805acb1c-739c-4f4a-a529-3027c95f8c60', str(question.course.id))

class DummyEstimatorTests(TestBase):
    """
    Unit tests for DummyEstimator
    """
    def test_estimate_level(self):
        """
        Test for estimate_level()
        """
        estimator = DummyEstimator()
        level = estimator.estimate_level()
        self.assertAlmostEqual(0.0, level)
        estimator = DummyEstimator(3.0)
        level = estimator.estimate_level()
        self.assertAlmostEqual(3.0, level)


class LearningEngineTests(TestBase):
    """
    Unit tests for LearningEngine
    """

    _transient_entities = [CourseStudentEntry, CourseStudentSnapshot, LearningSession]

    def setUp(self):
        super().setUp()
        self.course = dummy_course()
        questions = dummy_questions(self.course)
        for question in questions:
            question.save()
        self.question_source = RandomQuestionSource(self.course)
        self.user = User(
            uuid='edfac0ee-ff77-4996-8a47-af3b73cb6eba',
            first_name='Chuck',
            last_name='Norris'
        )
        self.estimator = DummyEstimator(3.0)
        self.learning_engine = LearningEngine(
            course=self.course,
            question_source=self.question_source,
            user=self.user,
            estimator=self.estimator)

    def tearDown(self):
        super().tearDown()
        for entity in self._transient_entities:
            entity.objects().delete()

    def test_start(self):
        """
        Test for start()
        """
        session = self.learning_engine.start()
        self.assertEqual(self.course.uuid, session.course.id)
        self.assertEqual(self.user.uuid, session.user.id)
        self.assertIsNotNone(session.start_time)
        self.assertIsNone(session.end_time)
        # Make sure it was saved
        db_session = LearningSession.objects(uuid=session.uuid).first()
        self.assertIsNotNone(db_session)

    def _create_session(self):
        session_uuid = uuid4()
        session = LearningSession(
            uuid=session_uuid,
            course=self.course,
            user=self.user,
            start_time=datetime.now(),
        )
        session.save()
        return session

    def test_resume(self):
        """
        Test for resume()
        """
        session = self._create_session()
        resumed_session = self.learning_engine.resume()
        self.assertIsNotNone(resumed_session)
        self.assertEqual(resumed_session.uuid, session.uuid)

    def test_start_or_resume_fresh(self):
        """
        Test for test_or_resume() without a preexisting sesssion
        """
        session = self.learning_engine.start_or_resume()
        self.assertIsNotNone(session)

    def test_start_or_resume_stale(self):
        """
        Test for test_or_resume() without a preexisting sesssion
        """
        session = self._create_session()
        resumed_session = self.learning_engine.start_or_resume()
        self.assertIsNotNone(resumed_session)
        self.assertEqual(session.uuid, resumed_session.uuid)

    def test_next(self):
        """
        Test for next()
        """
        self.learning_engine.start()
        question = self.learning_engine.next()
        self.assertIsNotNone(question)

    def test_next_no_session(self):
        """
        Test for next() without an active session
        """
        def try_next():
            self.learning_engine.next()
        self.assertRaises(ValueError, try_next)

    def test_submit(self):
        """
        Test for submit()
        """
        session = self.learning_engine.start()
        question = self.learning_engine.next()
        response = Response(question, [])
        course_entry = self.learning_engine.submit(response)
        self.assertIsNotNone(course_entry)
        self.assertEqual(self.course.uuid, course_entry.course.id)
        self.assertEqual(self.user.uuid, course_entry.user.id)
        self.assertEqual(3.0, course_entry.level)
        self.assertEqual(session.uuid, course_entry.last_session.id)
        snapshots = CourseStudentSnapshot.objects()
        self.assertEqual(1, len(snapshots))
        snapshot = snapshots.first()
        self.assertEqual(str(self.course.uuid), str(snapshot.course.id))
        self.assertEqual(str(self.user.uuid), str(snapshot.user.id))
        question = self.learning_engine.next()
        response = Response(question, [])
        self.estimator.value = 4.0
        self.learning_engine.submit(response)
        snapshots = CourseStudentSnapshot.objects().order_by('-as_of')
        self.assertEqual(2, len(snapshots))
        snapshot = snapshots.first()
        self.assertEqual(4.0, snapshot.level)
