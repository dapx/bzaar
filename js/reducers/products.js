import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS, SHOW_PRODUCT } from '../actionTypes/products';

export default function products(state = {}, action) {
  switch (action.type) {
    case REQUEST_PRODUCTS:
      return {
        ...state,
        loadingRequest: true,
      };

    case RECEIVE_PRODUCTS:
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    case SHOW_PRODUCT:
      return {
        ...state,
        product: action.data,
      };

    default:
      return state;
  }
}
