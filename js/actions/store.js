import { REQUEST_PRODUCTS, RECEIVE_PRODUCTS } from '../actionTypes/store';
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

export function listProductsByStore(jwt, storeId) {
  return (dispatch) => {
    dispatch(request());
    return ApiUtils.request(`stores/${storeId}/products`, jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        ApiUtils.error(error.message);
      });
  };
}
