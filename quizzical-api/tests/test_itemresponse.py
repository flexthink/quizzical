"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Item Response Theory tests
"""
from unittest import TestCase

import numpy as np
from core.itemresponse import characteristic, likelihood, level_likelihood, estimate_level

class BuildingElementsTest(TestCase):
    """
    Unit tests for the basic building blocks of Item Response Theory
    """
    def test_characteristic(self):
        """
        Test for the characteristic function
        """
        value = characteristic(0.)
        self.assertAlmostEqual(0.5, value)
        value = characteristic(-1.)
        self.assertAlmostEqual(0.269, value, 3)
        value = characteristic(1.5)
        self.assertAlmostEqual(0.818, value, 3)

    def test_likelihood(self):
        """
        Test for the likelihood function
        """
        items = np.array([
            [-2., 1.],
            [0., 0.],
            [-1., 1.],
            [1., 0.]
        ])
        value = likelihood(items.T)
        self.assertAlmostEqual(0.00431, value, 5)

    def test_level_likelihood(self):
        """
        Test for level_likelihood
        """
        items = np.array([
            [5., 1.],
            [3., 0.],
            [4., 1.],
            [2., 0.]
        ])
        value = level_likelihood(3., items.T)
        self.assertAlmostEqual(0.00431, value, 5)

    def test_estimate_level(self):
        """
        Test for estimate_level
        """
        items = np.array([
            [5., 0.],
            [3., 1.],
            [4., 0.],
            [2., 1.]
        ])
        level = estimate_level(items.T)
        self.assertAlmostEqual(3.5, level, 1)
