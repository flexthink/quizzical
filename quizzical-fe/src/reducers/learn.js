import { LEARN_PRACTICE_START, LEARN_PRACTICE_QUESTION_RECEIVE, LEARN_PRACTICE_QUESTION_UPDATE_ANSWER } from '../actions/actionTypes';

const answerUpdate = {
    single: (answers, action) => answers.map(
                answer => ({...answer, checked: (answer.uuid === action.answer.uuid)})
    ),
    multiple: (answers, action) => answers.map(
            answer => (answer === action.answer) ? 
            {...answer, checked: !answer.checked}: answer
    )
}

const reducer = (state={}, action) => {
    switch (action.type) {
        case LEARN_PRACTICE_START: 
            return {
                ...state,
                sessionStats: {
                    questions: 0,
                    startTime: new Date(),
                }
            };
        case LEARN_PRACTICE_QUESTION_RECEIVE:
            return {
                ...state,
                question: action.question,
            };
        case LEARN_PRACTICE_QUESTION_UPDATE_ANSWER:
            const updateAnswers = state.question.multiple ? answerUpdate.multiple : answerUpdate.single;
            return {
                ...state,
                question: {
                    ...state.question,
                    answers: updateAnswers(state.question.answers, action)
                }
            }
        default:
            return state
    }
}

export default reducer
