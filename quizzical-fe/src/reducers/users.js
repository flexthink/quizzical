import {
    USER_LIST_RECEIVE,
    USER_RECEIVE,
    USER_UPDATE,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGOUT
} from '../actions/actionTypes';

import keyBy from 'lodash/keyBy';
import uuidv4 from 'uuid/v4';

export default (state = {}, action) => {
    switch (action.type) {
        case USER_LIST_RECEIVE:
            return {
                ...state,
                byId: keyBy(action.users, 'uuid'),
                allIds: action.users.map(user => user.uuid)
            };
        case USER_RECEIVE:
        case USER_UPDATE:
            // TODO: Update it everywhere
            return {
                ...state,
                current: {
                    ...action.user,
                    uuid: action.user.uuid || uuidv4()
                }
            };
        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                login: {
                    loggedOn: true,
                    token: action.result.token,
                },
            };
        case USER_LOGIN_FAILURE:
            return {
                ...state,
                login: {
                    failure: true,
                }
            };
        case USER_LOGOUT:
            return {
                ...state,
                login: {
                    loggedOn: false,
                }
            };
     default:
      return state
    }
}