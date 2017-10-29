import {
  REQUEST_MYSTORES,
  RECEIVE_MYSTORES,
  OPEN_MYSTORE,
  EDIT_STORE,
  OPEN_PRODUCTS,
  OPEN_NEW_STORE,
 } from '../actionTypes/myStores';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { ApiUtils } from '../utils/api';

function request() {
  return {
    type: REQUEST_MYSTORES,
  };
}

function receive(data) {
  return {
    type: RECEIVE_MYSTORES,
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
    return ApiUtils.request('my_stores', jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}

export function openStore(store) {
  return dispatch => dispatch({ type: OPEN_MYSTORE, store });
}

export function openNewStore() {
  const store = {
    id: 0,
    name: '',
    description: '',
    logo: '',
  }
  return dispatch => dispatch({ type: OPEN_NEW_STORE, store });
}

export function editStore(store) {
  return dispatch => dispatch({ type: EDIT_STORE, store });
}

export function openProducts(store_id) {
  return dispatch => dispatch({ type: OPEN_PRODUCTS, store_id });
}