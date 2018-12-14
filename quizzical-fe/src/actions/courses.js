import { 
    COURSE_NEW,
    COURSE_EDIT,
    COURSE_LIST_REQUEST,
    COURSE_LIST_RECEIVE,
    COURSE_RECEIVE,
    COURSE_REQUEST,
    COURSE_UPDATE 
} from './actionTypes';

import { API } from '../config';
import { action } from './util';
import crud from './crud';

export const 
    requestList = action(COURSE_LIST_REQUEST),
    receiveList = action(COURSE_LIST_RECEIVE, 'courses'),
    receive = action(COURSE_RECEIVE, 'course'),
    request = action(COURSE_REQUEST),
    create = action(COURSE_NEW),
    edit = action(COURSE_EDIT, 'id'),
    update = action(COURSE_UPDATE, 'course');
    

export const {getList, get, save} = crud({
    stateKey: 'courses',
    resourceUrl: `${API}/courses`,
    url: '/courses',
    actions: {
        receiveList,
        receive,
        update
    }
});
