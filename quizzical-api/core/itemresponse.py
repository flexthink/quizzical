"""
QuizzICAL

(C) 2018 by Artem Ploujnikov. All rights reserved.

Core - Item Resposnse Theory implementation

This is an implementation of Item Response Theory suitable to be run
during a student's learning session on a small number of parameters.

A more elaborate, vectorized implementation will be needed to re-evaluate
an entire course in batch mode.
"""
import numpy as np
from scipy.optimize import minimize

from enum import Enum

class ItemResponseParameter(Enum):
    """
    An enumertion of available parameters in Item Response Theory
    """
    ABILITY = 0
    DIFFICULTY = 1

def characteristic(delta):
    """
    The characteristic function for an item, defining the assumed
    probability of obtaining a correct response given a difference
    (delta) between the student's ability level in the concept or
    subject being tested or studied and the item's difficulty

    :param delta: the difference between the ability level of the
    respondent and the difficulty level of the item
    """
    exp_factor = np.exp(delta)
    return exp_factor / (1 + exp_factor)


def likelihood(items):
    """
    The likelihood function, defining the probability distribution
    of obtaining a given set of responses at a given ability level

    :param items: an n x 2 matrix or a tuple of vectors (or any structure convertible to 
    a NumPy array) with ability - difficulty deltas in column 0 and the item score in column 1.

    Item scores are expect to range from 0 to 1 with 0 meaning no credit
    for the answer and 1 meaning full credit. The approach works equally well
    with both right/wrong items and items on which a respondent can obtain
    partial credit.
    """
    delta, score = items
    characteristic_value = characteristic(delta)
    return np.product(
        (characteristic_value**score)
        *
        (1. - characteristic_value)**(1. - score))

_PARAMETER_FACTORS = [1., -1.]

def level_likelihood(level, items,
                     parameter: ItemResponseParameter
                     = ItemResponseParameter.ABILITY):
    """
    Determines the value of the Item Response Theory likelihood function at
    a given level of ability or difficulty
    """
    item_level, score = items
    parameter_factor = _PARAMETER_FACTORS[parameter.value]
    delta = parameter_factor * (level - item_level)
    return likelihood((delta, score))

_DEFAULT_STARTING_ESTIMATE = 2.5

def estimate_level(items, starting_estimate=None,
                   parameter: ItemResponseParameter
                   = ItemResponseParameter.ABILITY):
    """
    Estimates the student's ability level, using numerical methods
    """
    if starting_estimate is None:
        starting_estimate = _DEFAULT_STARTING_ESTIMATE
    def objective(level):
        return -level_likelihood(level, items, parameter)
    result = minimize(objective, x0=starting_estimate)
    (value,) = result.x
    return value
