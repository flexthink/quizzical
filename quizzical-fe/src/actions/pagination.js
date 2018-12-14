import {
    PAGINATION_UPDATE
} from './actionTypes';

import { action } from './util';

export const update = action(PAGINATION_UPDATE, 'id', 'settings');

export const sortPaginate = (id, settings, fetch) => async dispatch => {
    await dispatch(update(id, settings));
    await dispatch(fetch);
}
