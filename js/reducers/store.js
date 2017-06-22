import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS } from '../actionTypes/store';
import { OPEN_STORE } from '../actionTypes/stores';

export default function store(state = {}, action){
  switch(action.type){
    case REQUEST_PRODUCTS: {
      return {
        ...state,
        loadingRequest: true,
      };
    };
    case RECEIVE_PRODUCTS: {
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };
    }
    case OPEN_STORE: {
      store = action.store;
      return {
        ...state,
        ...store
      };
    }

    default:
      return state;
  }
}