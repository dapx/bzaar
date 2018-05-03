import { ApiUtils } from '../utils/api';
import * as Actions from '../actionTypes/orders';

export function update(jwt, itemCartData, storeId) {
  return (dispatch) => {
    dispatch({ type: Actions.UPDATE_ORDER_ITEM });
    return ApiUtils
      .create(`stores/${storeId}/item_cart/${itemCartData.item_cart.id}`, jwt, itemCartData, 'PUT')
      .then(data => dispatch({ type: Actions.UPDATED_ORDER_ITEM, ...data }))
      .catch(error => ApiUtils.error(error.message));
  };
}

function requestItems() {
  return {
    type: Actions.REQUEST_ORDER_ITEMS,
  };
}

function receiveItems(data) {
  return {
    type: Actions.RECEIVE_ORDER_ITEMS,
    ...data,
  };
}

export function listStoreOrders(jwt, storeId) {
  return (dispatch) => {
    dispatch(requestItems());
    return ApiUtils.request(`stores/${storeId}/item_cart`, jwt)
      .then(data => dispatch(receiveItems(data)))
      .catch((error) => {
        ApiUtils.error(error.message);
      })
      .done();
  };
}
