import { REQUEST, RECEIVE, TYPE_EMAIL, TYPE_NAME, TYPE_SURNAME, TYPE_PASSWORD, TYPE_CONFIRM_PASSWORD } from '../actionTypes/register'

export default function register(state = {}, action){
  switch(action.type){
    case REQUEST:
      return {
        ...state,
        pendingRequest: true,
      }
    case RECEIVE:
      return {
        ...state,
        pendingRequest: false,
        email: action.email,
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