import {
    QUESTION_LIST_RECEIVE,
    QUESTION_RECEIVE,
    QUESTION_EDIT,
    QUESTION_DELETE,
    QUESTION_ANSWER_ADD,
    QUESTION_ANSWER_DELETE,
    QUESTION_ANSWER_UPDATE,
    QUESTION_UPDATE,
    QUESTION_DELETE_PROMPT,
    QUESTION_DELETE_CANCEL
} from './actionTypes';

import { action } from './util';
import fetch from 'cross-fetch';
import { API } from '../config';
import { get as fetchCourse  } from './courses';
import { range } from 'lodash';
import uuid from 'uuid/v4';
import crud from './crud';
import { goBack } from 'connected-react-router';

export const 
    editQuestion = action(QUESTION_EDIT),
    deleteQuestion = action(QUESTION_DELETE),
    receiveList = action(QUESTION_LIST_RECEIVE, 'questions'),
    receive = action(QUESTION_RECEIVE, 'question'),
    update = action(QUESTION_UPDATE, 'question'),
    promptDeleteQuestion = action(QUESTION_DELETE_PROMPT, 'question'),
    cancelDeleteQuestion = action(QUESTION_DELETE_CANCEL);

export const {getList, get, save} = crud({
    stateKey: 'questions',
    listUrl: `${API}/courses/{courseId}/questions`,
    resourceUrl: `${API}/questions`,
    resourceParameters: ['courseId'],
    url: '/courses/{courseId}/questions',
    forceFetch: true,
    onFetch: (dispatch, courseId) => dispatch(fetchCourse(courseId)),
    actions: {
        receiveList,
        receive,
        update
    }
});


const answerTemplate = () => ({uuid: uuid(),
answer: ''}) ;

const questionTemplate = () => ({
    question: '',
    answers: range(4).map(answerTemplate),
});

export function newQuestion(courseId) {
    return async dispatch => {
        await dispatch(fetchCourse(courseId));
        dispatch(receive(questionTemplate()));
    }
}

export function addAnswer(answer=null) {
    if (!answer) {
        answer = answerTemplate();
    }
    return {type: QUESTION_ANSWER_ADD, answer};
}

export const saveQuestion = question => async (dispatch,
    getState) => {
        await dispatch(update(question));
        const globalState = getState();
        const {questions} = globalState;
        const questionData = questions.current;
        await fetch(
            `${API}/questions/${questionData.uuid}`,
            {
                method: 'PUT',
                body: JSON.stringify(questionData),
                headers: {'Content-Type': 'application/json'},
                globalState
            });
        dispatch(goBack());
    }
    

export const deleteAnswer = action(QUESTION_ANSWER_DELETE,
'answer');
export const updateAnswer = action(QUESTION_ANSWER_UPDATE,
'answer',
'updates');


export const confirmDeleteQuestion = async (dispatch, getState) => {
    const globalState = getState();
    const { questions } = globalState;
    
    const question = questions.byId[questions.toDelete];

    await fetch(
        `${API}/questions/${question.uuid}`,
        {
            method: 'DELETE',
            globalState
        }
    );

    dispatch(deleteQuestion(question));
}