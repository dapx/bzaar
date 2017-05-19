import { REQUEST_REGISTER, RECEIVE_REGISTER, TYPE_EMAIL, TYPE_NAME, TYPE_SURNAME, TYPE_PASSWORD, TYPE_CONFIRM_PASSWORD } from '../actionTypes/register'
import { RECEIVE_ERROR } from '../actionTypes/error';

export default function register(state = {}, action){
  switch(action.type){
    case REQUEST_REGISTER:
      return {
        ...state,
        pendingRequest: true,
      }
    case RECEIVE_REGISTER:
      return {
        ...state,
        pendingRequest: false,
      }

    case RECEIVE_ERROR:
      return {
        ...state,
        pendingRequest: false,
      }

    case TYPE_EMAIL:
      return {
        ...state,
        email: action.text,
      }
    case TYPE_NAME:
      return {
        ...state,
        name: action.text,
      }
    case TYPE_SURNAME:
      return {
        ...state,
        surname: action.text,
      }
    case TYPE_PASSWORD:
      return {
        ...state,
        password: action.text,
      }
    case TYPE_CONFIRM_PASSWORD:
      return {
        ...state,
        confirmPassword: action.text,
      }
    default:
      return state;
  }

}