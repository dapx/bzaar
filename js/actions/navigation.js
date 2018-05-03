import {
  USER_REGISTER,
  CREDITCARD_REGISTER,
  BACK,
  USER,
  BAG,
  PRODUCT,
  ORDERS,
} from '../actionTypes/navigation';

export function userRegister() {
  return {
    type: USER_REGISTER,
  };
}

export function user() {
  return {
    type: USER,
  };
}

export function bag() {
  return {
    type: BAG,
  };
}

export function creditCard() {
  return {
    type: CREDITCARD_REGISTER,
  };
}

export function back() {
  return {
    type: BACK,
  };
}

export function product() {
  return {
    type: PRODUCT,
  };
}

export function orders() {
  return {
    type: ORDERS,
  };
}
