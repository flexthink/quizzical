import {
    PAGINATION_UPDATE
} from '../actions/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case PAGINATION_UPDATE:
            return {
                ...state, 
                [action.id]: {
                    ...state[action.id],
                    ...action.settings
                }
            }
     default:
      return state
    }
   }