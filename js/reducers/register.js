import { REQUEST_REGISTER, RECEIVE_REGISTER } from '../actionTypes/register';
import RECEIVE_ERROR from '../actionTypes/error';

export default function register(state = {}, action) {
  switch (action.type) {

    case REQUEST_REGISTER:
      return {
        ...state,
        pendingRequest: true,
      };

    case RECEIVE_REGISTER:
      return {
        ...state,
        pendingRequest: false,
      };

    case RECEIVE_ERROR:
      return {
        ...state,
        pendingRequest: false,
      };

    default:
      return state;
  }
}
