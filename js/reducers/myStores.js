import { REQUEST_STORES, RECEIVE_STORES } from '../actionTypes/myStores';

export default function stores(state = {}, action) {
  switch (action.type) {

    case REQUEST_STORES:
      return {
        ...state,
        loadingRequest: true,
      };

    case RECEIVE_STORES:
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    default:
      return state;
  }
}
