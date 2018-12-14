import reducer from './courses';
import * as types from '../actions/actionTypes';

describe('courses reducer', () => {
    it('should handle COURSE_LIST_RECEIVE', () => {
        const courses = [
            {
                'uuid': '1aae457a-274d-40cd-bc12-311f6050fbe8',
                'title': 'algebra',
                'description': 'foo bar'
            },
            {
                'uuid': 'cbe3fbd3-0b07-42b7-95cb-1a3a88e7b34b',
                'title': 'calculus',
                'description': 'foo bar'
            },
        ];
        const action = {
            type: types.COURSE_LIST_RECEIVE,
            courses
        };
        expect(reducer(undefined, action)).toEqual(
            {
                allIds: ['1aae457a-274d-40cd-bc12-311f6050fbe8', 'cbe3fbd3-0b07-42b7-95cb-1a3a88e7b34b'],
                byId: {
                    '1aae457a-274d-40cd-bc12-311f6050fbe8': {
                        'uuid': '1aae457a-274d-40cd-bc12-311f6050fbe8',
                        'title': 'algebra',
                        'description': 'foo bar'
                    },
                    'cbe3fbd3-0b07-42b7-95cb-1a3a88e7b34b': {
                        'uuid': 'cbe3fbd3-0b07-42b7-95cb-1a3a88e7b34b',
                        'title': 'calculus',
                        'description': 'foo bar'
                    }
                }
            }
        );
    });

    it('should handle COURSE_RECEIVE', () => {
        const course = {
            'uuid': '1aae457a-274d-40cd-bc12-311f6050fbe8',
            'title': 'algebra',
            'description': 'foo bar'
        };

        const action = {
            type: types.COURSE_RECEIVE,
            course: course
        };
        expect(reducer(undefined, action)).toEqual(
            {
                current: course
            }
        );
    });

});