import { TYPE_EMAIL, TYPE_PASSWORD, REQUEST_LOGIN, RECEIVE_LOGIN } from '../actionTypes/login.js'

export default function loginReducer(state = [], action) {
  switch(action.type){
    case TYPE_EMAIL:
      return {...state, email: action.text}
    case TYPE_PASSWORD:
      return {...state, password: action.text}
    case REQUEST_LOGIN:
      return {...state, pendingLoginRequest: true}
    case RECEIVE_LOGIN:
      return {...state, pendingLoginRequest: false}
    
    default: 
      return state;
  }
}