import {
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  SHOW_PRODUCT,
  ADD_PRODUCT_TO_BAG,
  ADDED_PRODUCT_TO_BAG,
  RECEIVE_BAG_ITEMS,
  REQUEST_BAG_ITEMS,
  REMOVE_BAG_ITEMS,
  REMOVED_BAG_ITEMS,
} from '../actionTypes/products';
import RECEIVE_ERROR from '../actionTypes/error';
import { ApiUtils } from '../utils/api';

function request() {
  return {
    type: REQUEST_PRODUCTS,
  };
}

function receive(data) {
  return {
    type: RECEIVE_PRODUCTS,
    ...data,
  };
}

function requestBagItems() {
  return {
    type: REQUEST_BAG_ITEMS,
  };
}

function receiveBagItems(data) {
  return {
    type: RECEIVE_BAG_ITEMS,
    ...data,
  };
}

function receiveError(error) {
  return {
    type: RECEIVE_ERROR,
    error,
  };
}

export function list(jwt) {
  return (dispatch) => {
    dispatch(request());
    return ApiUtils.request('products', jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}

function addedProductToBag(data) {
  return dispatch => dispatch({ type: ADDED_PRODUCT_TO_BAG, data });
}

export function addProductToBag(jwt, productData) {
  return (dispatch) => {
    dispatch({ type: ADD_PRODUCT_TO_BAG });
    return ApiUtils.create('item_cart', jwt, productData)
      .then(response => dispatch(addedProductToBag(response)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}

export function showProduct(data) {
  return dispatch => dispatch({ type: SHOW_PRODUCT, data });
}

export function listBagItems(jwt) {
  return (dispatch) => {
    dispatch(requestBagItems());
    return ApiUtils.request('item_cart', jwt)
      .then(data => dispatch(receiveBagItems(data)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}

function removeBagItems() {
  return {
    type: REMOVE_BAG_ITEMS,
  };
}

function removedBagItems() {
  return {
    type: REMOVED_BAG_ITEMS,
  };
}

export function removeBagItem(jwt, id) {
  return (dispatch) => {
    dispatch(requestBagItems());
    return ApiUtils.delete('item_cart', jwt, id)
      .then(data => dispatch(receiveBagItems(data)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}
