import { 
    QUESTION_LIST_RECEIVE,
    QUESTION_RECEIVE,
    QUESTION_UPDATE,
    QUESTION_ANSWER_ADD,
    QUESTION_ANSWER_DELETE,
    QUESTION_ANSWER_UPDATE,
    QUESTION_DELETE_PROMPT,
    QUESTION_DELETE_CANCEL,
    QUESTION_DELETE,
    COURSE_RECEIVE 
} from '../actions/actionTypes';

import { keyBy, map } from 'lodash';
import uuidv4 from 'uuid/v4';
import without from 'lodash/without';
import omit from 'lodash/omit';

const answerUpdate = {
    single: (answers, action) => answers.map(
        answer => (answer.uuid === action.answer.uuid) ? 
                    ({...answer, ...action.updates}) :
                    ({...answer, checked: action.updates.checked ? false: answer.checked})
    ),
    multiple: (answers, action) => answers.map(
        answer => (answer.uuid === action.answer.uuid ? {...answer, ...action.updates}: answer)
    )
}


export default (state = {}, action) => {
    switch (action.type) {
        case COURSE_RECEIVE:
            return {...state, courseId: action.course.uuid};
        case QUESTION_LIST_RECEIVE:
            return {...state, byId: keyBy(action.questions, 'uuid'), allIds: map(action.questions, 'uuid')};
        case QUESTION_RECEIVE:
            return {...state, current: action.question};
        case QUESTION_UPDATE:
            return {
                ...state,
                current: {
                    ...state.current,
                    ...action.question,
                    course: state.courseId,
                    uuid: state.current.uuid || uuidv4()
                }
            };
        case QUESTION_ANSWER_ADD:
            return {
                ...state, 
                current: {
                    ...state.current,
                    answers: [...state.current.answers, action.answer]
                }
            };            
        case QUESTION_ANSWER_DELETE:
            return {
                ...state, 
                current: {
                    ...state.current,
                    answers: state.current.answers.filter(answer => answer.uuid !== action.answer.uuid)
                }
            };
        case QUESTION_ANSWER_UPDATE:
            const updateAnswers = state.current.multiple ? answerUpdate.multiple: answerUpdate.single;
            return {
                ...state,
                current: {
                    ...state.current,
                    answers: updateAnswers(state.current.answers, action)
                }
            };
        case QUESTION_DELETE_PROMPT:
            return {
                ...state,
                toDelete: action.question.uuid,
                confirmDeleteOpen: true,
            };
        case QUESTION_DELETE_CANCEL: 
            return {
                ...state,
                confirmDeleteOpen: false,
            };
        case QUESTION_DELETE:
            return {
                ...state,
                byId: omit(state.byId, state.toDelete),
                allIds: without(state.allIds, state.toDelete),
                confirmDeleteOpen: false,
                toDelete: null,
            };
        default:
            return state
    }
}