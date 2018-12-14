import * as types from '../actions/actionTypes';
import reducer from './learn';


describe('learn reducer', () => {
    it('should handle LEARN_PRACTICE_START', () => {
        const action = {
            type: types.LEARN_PRACTICE_START
        };

        const state = reducer({}, action);
        expect(state.sessionStats.questions).toEqual(0);
        expect(state.sessionStats.startTime).toBeInstanceOf(Date);
        
    });

    it('should handle LEARN_PRACTICE_QUESTION_RECEIVE', () => {
        const action = {
            type: types.LEARN_PRACTICE_QUESTION_RECEIVE,
            question: {
                uuid: 'adebc077-b781-4763-a91c-93891032dd7e',
                question: 'x + 2x ='
            }
        };    
        const state = reducer({}, action);
        expect(state.question.uuid).toEqual(action.question.uuid);
        expect(state.question.question).toEqual(action.question.question);
    });
});