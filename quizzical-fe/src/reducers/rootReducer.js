/*
 src/reducers/rootReducer.js
*/
import { connectRouter } from 'connected-react-router';

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import courseReducer from './courses';
import userReducer from './users';
import questionReducer from './questions';
import learnReducer from './learn';
import paginationReducer from './pagination';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist'

const userPersistConfig = {
    key: 'users',
    storage,
    whitelist: ['login']
}

const rootReducer = (history) => combineReducers({
    form: formReducer,
    router: connectRouter(history),
    courses: courseReducer,
    questions: questionReducer,
    learn: learnReducer,
    users: persistReducer(userPersistConfig, userReducer),
    pagination: paginationReducer,
});

export default rootReducer;