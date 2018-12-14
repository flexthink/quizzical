import {COURSE_LIST_RECEIVE, COURSE_RECEIVE, COURSE_UPDATE} from '../actions/actionTypes';
import { keyBy } from 'lodash';
import uuidv4 from 'uuid/v4';

export default (state = {}, action) => {
    switch (action.type) {
        case COURSE_LIST_RECEIVE:
            return {
                ...state,
                byId: keyBy(action.courses, 'uuid'),
                allIds: action.courses.map(course => course.uuid)
            }
        case COURSE_RECEIVE:
        case COURSE_UPDATE:
            // TODO: Update it everywhere
            return {
                ...state,
                current: {
                    ...action.course,
                    uuid: action.course.uuid || uuidv4()
                }
            }
     default:
      return state
    }
}