import { REGISTER, BACK } from '../actionTypes/navigation';

export function register() {
  return {
    type: REGISTER,
  }
}

export function back() {
  return {
    type: BACK,
  }
}