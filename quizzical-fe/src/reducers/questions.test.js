import reducer from './questions';
import * as types from '../actions/actionTypes';
import { last } from 'lodash';

describe('questions', () => {    
    it('should handle QUESTION_RECEIVE', () => {
        const question = 
        {
            uuid: '9cf619e6-1101-4569-9bad-de8bd630a728',
            question: 'The integral of e^(x^2)',
            answers: [
                {
                    answer: '2',
                    correct: false
                },
                {
                    answer: "I don't know",
                    correct: true
                }
            ]
        };
        const action = {
            type: types.QUESTION_RECEIVE,
            question
        };

        const state = reducer({}, action);
        expect(state.current.question).toEqual(question.question);
        expect(state.current.answers).toHaveLength(2);
    });

    it('should handle QUESTION_ANSWER_ADD', () => {
        const state = {
            current: {
                question: '2 + 2 =',
                answers: [
                    {
                        answer: '4',
                        correct: true,
                    },
                    {
                        answer: '5', 
                        correct: false,
                    }
                ]
            }
        };

        const answer = {
            answer: 'something between 0 and 10',
            correct: true,
        };

        const action = {
            type: types.QUESTION_ANSWER_ADD,
            answer
        };

        const newState = reducer(state, action);
        expect(newState.current.answers).toHaveLength(3);
        const lastAnswer = last(newState.current.answers);
        expect(lastAnswer.answer).toEqual('something between 0 and 10');
    });

});