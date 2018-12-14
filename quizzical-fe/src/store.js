import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { persistStore } from 'redux-persist'


export const history = createBrowserHistory();


// TODO: Replace this with a clean state when a back-end is hooked up

const defaultEntityState = () => ({
  byId: {},
  allIds: [],
  current: {}
});

const appInitialState = {
  courses: defaultEntityState(),
  questions: defaultEntityState(),
  users: {
    ...defaultEntityState(),
    login: {
      loggedOn: false
    }
  },
  learn: {},
  pagination: {}
};
const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(routerMiddleware(history), thunk)
);

export default function configureStore() {
  const store = createStore(
    rootReducer(history),
    appInitialState,
    enhancer
  );
  const persistor = persistStore(store);
  return {store, persistor};
}