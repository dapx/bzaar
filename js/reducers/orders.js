import {
  REQUEST_ORDER_ITEMS,
  RECEIVE_ORDER_ITEMS,
  UPDATED_ORDER_ITEM,
} from '../actionTypes/orders';

export default function orders(state = { loadingRequest: false, list: [] }, action) {
  switch (action.type) {
    case REQUEST_ORDER_ITEMS:
      return {
        ...state,
        loadingRequest: true,
      };

    case RECEIVE_ORDER_ITEMS:
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    case UPDATED_ORDER_ITEM: {
      const changedItemIndex = state.list.findIndex(i => i.id === action.data.id);
      const list = [
        ...state.list.slice(0, changedItemIndex), // List before item
        action.data, // New item
        ...state.list.slice((changedItemIndex + 1)), // List after item
      ];
      return {
        ...state,
        list,
      };
    }

    default:
      return state;
  }
}
