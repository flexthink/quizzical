import {
    USER_LIST_RECEIVE,
    USER_RECEIVE,
    USER_UPDATE,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILURE,
    USER_LOGOUT
} from './actionTypes';

import { action } from './util';
import crud from './crud';
import fetch from 'cross-fetch';
import { push } from 'connected-react-router';

import { API } from '../config';

export const 
    receiveList = action(USER_LIST_RECEIVE, 'users'),
    receive = action(USER_RECEIVE, 'user'),
    update = action(USER_UPDATE, 'user'),
    loginSuccess = action(USER_LOGIN_SUCCESS, 'result'),
    loginFailure = action(USER_LOGIN_FAILURE, 'result'),
    logout = action(USER_LOGOUT);

export const {getList, get, save} = crud({
    stateKey: 'users',
    resourceUrl: `${API}/users`,
    url: '/users',
    actions: {
        receiveList,
        receive,
        update
    }
});

export const authenticate = request => async dispatch => {
    const response = await fetch(`${API}/users/authenticate`, {
        method: "POST",
        body: JSON.stringify(request),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const result = await response.json();
    if (response.status === 200) {
        localStorage.setItem('token', result.token);
        await dispatch(loginSuccess(result));
        dispatch(push('/courses'));
    } else {
        await dispatch(loginFailure(result));
    }
}
