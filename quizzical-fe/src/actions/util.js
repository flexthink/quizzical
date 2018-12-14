import crossFetch from 'cross-fetch';

/**
 * A convenience function to construct a Redux action creator
 * 
 * @param {string} type the action type constant
 * @param {Array} argNames an array of arguments
 */
export function action(type, ...argNames) {
    return function(...args) {
      const action = { type }
      argNames.forEach((arg, index) => {
        action[argNames[index]] = args[index]
      })
      return action
    }
}

/**
 * A convenience function to fetch an object from the API if it is not already
 * in the state
 * 
 * @param {Function} dispatch the Redux dispatch function
 * @param {object} state the state to examine
 * @param {object} params the parameters: {id, receiveAction, url}
 * 
 *                        id: the item ID
 *                        receiveAction: the action to dispatch 
 *                        url: the service URL
 *                        force: where to force a fetch even 
 */
export function fetchIfNecessary(dispatch, state, params) {
    const {id, receiveAction, url, globalState, force} = params;
    const cached = state.byId[id];
    if (cached && !force) {
        dispatch(receiveAction(cached));
    } else {
        const effectiveUrl = url.replace('{id}', id);
        return fetch(effectiveUrl, {}, globalState)
            .then(response => response.json())
            .then(result => dispatch(receiveAction(result)));
    }
}

/**
 * Adds authentication information to a request
 * 
 * @param {object} request fetch fequest parameters
 * @param {object} state   the full Redux state, as obtained by getState in a thunk
 */
export function authenticate(request, state = {}) {
    let effectiveRequest = request;
    const { users = {login: {}} } = state;
    if (users.login.loggedOn) {
        effectiveRequest = {
            ...request,
            headers: {
                ...(request.headers || {}),
                authorization: `Bearer ${users.login.token}`
            }
        }
    }
    return effectiveRequest;
}

/**
 * A wrapper for crossfetch
 * 
 * @param {string} url the URL to post requests to
 * @param {object} request the request parameters (method, etc)
 * @param {object} state the full Redux state
 */
export function fetch(url, request, state) {
    const effectiveRequest = authenticate(request, state);
    if (!effectiveRequest.method) {
        effectiveRequest.method = 'GET';
    }
    return crossFetch(url, effectiveRequest);
}