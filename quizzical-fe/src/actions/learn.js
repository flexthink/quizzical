import { LEARN_PRACTICE_QUESTION_UPDATE_ANSWER, LEARN_PRACTICE_QUESTION_RECEIVE } from './actionTypes';
import { get as fetchCourse } from './courses';
import { goBack } from 'connected-react-router';
import { action } from './util';
import fetch from 'cross-fetch';
import { API } from '../config';

export const updateAnswer = action(LEARN_PRACTICE_QUESTION_UPDATE_ANSWER, 'answer');
export const receiveQuestion = action(LEARN_PRACTICE_QUESTION_RECEIVE, 'question');

export const startPractice = courseId => async dispatch => {
    await dispatch(fetchCourse(courseId));
    const response = await fetch(`${API}/learn/course/${courseId}/start`, 
    {
        method: 'POST'
    });
    const result = await response.json();
    dispatch(receiveQuestion(result.next_question));
}

// TODO: Make this generic, reorganize
function getAnswerPayload(question) {
    return {
        question_uuid: question.uuid,
        answer: question.answers.filter(
            answer => answer.checked).map(answer => answer.uuid)
    }
}

export const submit = () => async (dispatch, getState) => 
{
    const {learn, courses} = getState();
    const course = courses.current;
    const question = learn.question;
    
    const response = await fetch(`${API}/learn/course/${course.uuid}/submit`,
    {
        method: 'POST',
        body: JSON.stringify(getAnswerPayload(question)),
        headers: {'Content-Type': 'application/json'}

    });
    const result = await response.json();
    dispatch(receiveQuestion(result.next_question));
}

export const stopPractice = () => async dispatch => {
    dispatch(goBack());
}