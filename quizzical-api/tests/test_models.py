#pylint: disable=W0104
"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Model tests
"""
from uuid import uuid4

from tests import TestBase
from core.models import Question, AnswerChoice

class QuestionTests(TestBase):
    """
    Unit tests for Question
    """
    def test_score_single(self):
        """
        Test for score() when only a single answer is correct
        """
        answers = [
            AnswerChoice(
                uuid=uuid4(),
                answer='0',
                checked=False
            ),
            AnswerChoice(
                uuid=uuid4(),
                answer='4',
                checked=True
            ),
            AnswerChoice(
                uuid=uuid4(),
                answer='5',
                checked=False
            )
        ]
        question = Question(
            uuid=uuid4(),
            question='2+2=?',
            answers=answers,
            multiple=False
        )
        for answer in answers:
            expected_score = 1.0 if answer.checked else 0.0
            score = question.score([answer.uuid])
            self.assertAlmostEqual
            (expected_score, score)

    def test_score_multiple(self):
        """
        Test for score() in the multi-select scenario. Coursera-style scoring is expected.
        """
        answers = [
            AnswerChoice(
                uuid=uuid4(),
                answer='Panama',
                checked=True
            ),
            AnswerChoice(
                uuid=uuid4(),
                answer='Montreal',
                checked=False
            ),
            AnswerChoice(
                uuid=uuid4(),
                answer='Canada',
                checked=True
            ),
            AnswerChoice(
                uuid=uuid4(),
                answer='Overfitting',
                checked=False
            )
        ]
        question = Question(
            question="Which of the following are countries?",
            answers=answers,
            multiple=True
        )
        def get_uuids(*indexes):
            return [answers[idx].uuid for idx in indexes]

        score = question.score([])
        self.assertAlmostEqual(0.5, score)
        score = question.score(get_uuids(0, 2))
        self.assertAlmostEqual(1.0, score)
        score = question.score(get_uuids(0, 1, 3))
        self.assertAlmostEqual(0.25, score)
        score = question.score(get_uuids(0, 2, 3))
        self.assertAlmostEqual(0.75, score)
