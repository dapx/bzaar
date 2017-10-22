import {
  REQUEST_BAG_ITEMS,
  RECEIVE_BAG_ITEMS,
  ADD_PRODUCT_TO_BAG,
  ADDED_PRODUCT_TO_BAG,
} from '../actionTypes/products';

export default function bag(state = { loadingRequest: false, list: [] }, action) {
  switch (action.type) {
    case REQUEST_BAG_ITEMS:
      return {
        ...state,
        loadingRequest: true,
      };

    case RECEIVE_BAG_ITEMS:
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    case ADD_PRODUCT_TO_BAG:
    case ADDED_PRODUCT_TO_BAG:
    default:
      return state;
  }
}
