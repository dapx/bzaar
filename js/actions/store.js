import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS } from '../actionTypes/store';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { ApiUtils } from '../utils/api';
import { Alert } from 'react-native';

function request() {
  return {
    type: REQUEST_PRODUCTS,
  }
}

function receive(data) {
  return {
    type: RECEIVE_PRODUCTS,
    ...data
  }
}

function receiveError(error){
  return {
    type: RECEIVE_ERROR,
    error
  }
}

export function listProductsByStore(jwt, storeId) {
  return dispatch => {
    dispatch(request());
    return ApiUtils.request(`stores/${storeId}/products`, jwt)
      .then((data) => {
        dispatch(receive(data));
      })
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  }
}
