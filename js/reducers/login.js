import {
  TYPE_EMAIL,
  TYPE_PASSWORD,
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
} from '../actionTypes/login';
import RECEIVE_ERROR from '../actionTypes/error';

export default function login(state = {}, action) {
  switch (action.type) {
    case REQUEST_LOGIN:
      return { ...state, pendingRequest: true };
    case RECEIVE_LOGIN:
      return {
        ...state,
        user: action.user,
        jwt: action.jwt,
        pendingRequest: false,
        errorMessage: '',
      };
    case RECEIVE_ERROR:
      return {
        ...state,
        pendingRequest: false,
        showToast: true,
        errorMessage: action.text,
      };

    default:
      return state;
  }
}
