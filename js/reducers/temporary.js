import { ADDRESS } from '../actionTypes/navigation';

/**
 * This reducer is used to store temporary objects in state.
 * These temporary objects are used commonly to be passed to another scene.
 * It's widely used to select an item and update it.
 */
export default function temporary(state = {}, action) {
  switch (action.type) {
    case ADDRESS: {
      return {
        ...state,
        address: action.data,
      };
    }

    default: return state;
  }
}
