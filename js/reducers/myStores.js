import {
  REQUEST_MYSTORES,
  RECEIVE_MYSTORES,
  OPEN_MYSTORE,
  EDIT_STORE,
} from '../actionTypes/myStores';

export default function stores(state = {}, action) {
  switch (action.type) {

    case REQUEST_MYSTORES:
      return {
        ...state,
        loadingRequest: true,
      };

    case RECEIVE_MYSTORES:
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    case EDIT_STORE:
    case OPEN_MYSTORE:
      return {
        ...state,
        store: action.store,
      };

    default:
      return state;
  }
}
