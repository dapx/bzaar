import { REQUEST_STORES, RECEIVE_STORES, OPEN_STORE } from '../actionTypes/stores';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { ApiUtils } from '../utils/api';

function request() {
  return {
    type: REQUEST_STORES,
  };
}

function receive(data) {
  return {
    type: RECEIVE_STORES,
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
    return ApiUtils.request('stores', jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        ApiUtils.error(error.message);
      })
      .done();
  };
}

export function openStore(store) {
  return dispatch => dispatch({ type: OPEN_STORE, store });
}
