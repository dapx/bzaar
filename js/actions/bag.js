import { ApiUtils } from '../utils/api';
import * as Actions from '../actionTypes/bag';

export function confirmOrder(jwt, itemCartData) {
  return (dispatch) => {
    dispatch({ type: Actions.CONFIRM_BAG_ITEM });
    return ApiUtils
      .create(`item_cart/${itemCartData.item_cart.id}`, jwt, itemCartData, 'PUT')
      .then(data => dispatch({ type: Actions.CONFIRMED_BAG_ITEM, ...data }))
      .catch(error => ApiUtils.error(error.message));
  };
}

function addedProductToBag(data) {
  return dispatch => dispatch({ type: Actions.ADDED_PRODUCT_TO_BAG, data });
}

export function addProductToBag(jwt, productData) {
  return (dispatch) => {
    dispatch({ type: Actions.ADD_PRODUCT_TO_BAG });
    return ApiUtils.create('item_cart', jwt, productData)
      .then(response => dispatch(addedProductToBag(response)))
      .catch((error) => {
        ApiUtils.error(error.message);
      });
  };
}

function requestItems() {
  return {
    type: Actions.REQUEST_BAG_ITEMS,
  };
}

function receiveItems(data) {
  return {
    type: Actions.RECEIVE_BAG_ITEMS,
    ...data,
  };
}

export function listBagItems(jwt) {
  return (dispatch) => {
    dispatch(requestItems());
    return ApiUtils.request('item_cart', jwt)
      .then(data => dispatch(receiveItems(data)))
      .catch((error) => {
        ApiUtils.error(error.message);
      })
      .done();
  };
}

function removeItem() {
  return {
    type: Actions.REMOVE_BAG_ITEM,
  };
}

function removedItem(itemId) {
  return {
    type: Actions.REMOVED_BAG_ITEM,
    itemId,
  };
}

// TODO - Change the actions creator
export function deleteItem(jwt, id) {
  return (dispatch) => {
    dispatch(removeItem());
    return ApiUtils.delete('item_cart', jwt, id)
      .then(() => dispatch(removedItem(id)))
      .catch((error) => {
        ApiUtils.error(error.message);
      })
      .done();
  };
}

