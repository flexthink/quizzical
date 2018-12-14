import { fetchIfNecessary } from './util';
import { goBack } from 'connected-react-router';
import { fetch } from './util';
import reduce from 'lodash/reduce';
import queryString from 'query-string';


/**
 * Adds pagination information to a URL
 * 
 * @param {string} url the target URL
 * @param {object} stateKey the key within pagination state storing
 *                          pagination parameters
 * @param {object} state the global state
 */
function addPagination(url, stateKey, state) {
    const params = state.pagination[stateKey];
    return params ? `${url}/?${queryString.stringify(params)}`: `${url}/`;
}

function addParameters(url, parameters=[], args) {
    return args ? reduce(parameters,
        (result, value, idx) => result.replace(`{${value}}`, args[idx]),
        url
    ): url;
}

/**
 * Runs an async callback if it is defined
 */
async function runIfDefined(callback, ...args) {
    if (callback) {
        return await callback(...args);
    }
}

function getEffectiveResourceUrl(resourceUrl, resourceParameters, stateKey, state, args)
{
    let effectiveUrl = addPagination(resourceUrl, stateKey, state);
    effectiveUrl = addParameters(effectiveUrl, resourceParameters, args);
    return effectiveUrl;
}

/**
 * Generates the thunks required for CRUD operations for an entity 
 * from the provided configuration object.
 * 
 * Keys:
 * stateKey - the key under which the entity is stored in the
 *            global Redux state
 * resourceUrl - the API URL for the resource
 * 
 * url - the URL within the application to which to redirect after
 * saving an item
 * 
 * @example
 * export const {getList, get, save} = crud({
 *   stateKey: 'courses',
 *   resourceUrl: `${API}/courses`,
 *   actions: {
 *       receiveList,
 *       receive,
 *       update
 *   }
 * });
 */
function crud({
    stateKey,
    resourceParameters,
    resourceUrl,
    listUrl,
    actions,
    url,
    onFetch,
    forceFetch
}) {
    const { receiveList, receive, update } = actions;

    
    return {
        getList: (...args) => async (dispatch, getState) => {
            const state = getState();
            runIfDefined(onFetch, dispatch, ...args);
            const baseUrl = listUrl || resourceUrl;
            const effectiveUrl = getEffectiveResourceUrl(
                baseUrl, resourceParameters, stateKey, state, args);
            const response = await fetch(effectiveUrl, {}, state);
            const items = await response.json();            
            dispatch(receiveList(items));
        },
        get: (itemId, ...args) => async (dispatch, getState) => {
            const globalState = getState()
            runIfDefined(onFetch, dispatch, ...args);
            const state = globalState[stateKey];
            
            return fetchIfNecessary(dispatch, state, {
                id: itemId, 
                url: addParameters(`${resourceUrl}/{id}`, resourceParameters, args),
                receiveAction: receive,
                force: forceFetch,
                globalState,
            });        
        },
        save: (values, args) => async (dispatch, getState) => {            
            dispatch(update(values));
            const globalState = getState()
            const state = globalState[stateKey];
            
            await fetch(
                addParameters(`${resourceUrl}/${state.current.uuid}`, resourceParameters, args),
                {
                    method: 'PUT', 
                    body: JSON.stringify(state.current),
                    headers: {'Content-Type': 'application/json'}
                },
                globalState
            );
            
            dispatch(goBack());
        },

    }
}

export default crud;