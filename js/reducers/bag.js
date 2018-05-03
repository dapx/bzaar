import {
  REQUEST_BAG_ITEMS,
  RECEIVE_BAG_ITEMS,
  ADD_PRODUCT_TO_BAG,
  ADDED_PRODUCT_TO_BAG,
  CONFIRM_BAG_ITEM,
  CONFIRMED_BAG_ITEM,
  REMOVE_BAG_ITEM,
  REMOVED_BAG_ITEM,
} from '../actionTypes/bag';

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

    case REMOVED_BAG_ITEM: {
      const list = state.list.filter(i => i.id !== action.itemId);
      return {
        ...state,
        list,
      };
    }

    case CONFIRMED_BAG_ITEM: {
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

    case REMOVE_BAG_ITEM:
    case CONFIRM_BAG_ITEM:
    case ADD_PRODUCT_TO_BAG:
    case ADDED_PRODUCT_TO_BAG:
    default:
      return state;
  }
}
