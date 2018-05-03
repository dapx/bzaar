import {
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  SHOW_PRODUCT,
} from '../actionTypes/products';
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

export function list(jwt) {
  return (dispatch) => {
    dispatch(request());
    return ApiUtils.request('products', jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        ApiUtils.error(error.message);
      })
      .done();
  };
}

export function showProduct(data) {
  return dispatch => dispatch({ type: SHOW_PRODUCT, data });
}
