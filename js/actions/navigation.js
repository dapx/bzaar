import { USER_REGISTER, CREDITCARD_REGISTER, BACK } from '../actionTypes/navigation';

export function userRegister() {
  return {
    type: USER_REGISTER,
  }
}

export function creditCard() {
  return {
    type: CREDITCARD_REGISTER,
  }
}

export function back() {
  return {
    type: BACK,
  }
}
