import { TYPE_EMAIL, TYPE_PASSWORD, REQUEST_LOGIN, RECEIVE_LOGIN, RECEIVE_ERROR } from '../actionTypes/login.js'

export default function login(state = [], action) {
  switch(action.type){
    case TYPE_EMAIL:
      return {...state, email: action.text}
    case TYPE_PASSWORD:
      return {...state, password: action.text}
    case REQUEST_LOGIN:
      return {...state, pendingLoginRequest: true}
    case RECEIVE_LOGIN:
      return {...state,
         user: action.user,
         jwt: action.jwt,
         pendingLoginRequest: false,
         errorMessage: ''
        }
    case RECEIVE_ERROR:
      return {...state,
         pendingLoginRequest: false,
         showToast: true,
         errorMessage: action.text
      }
    
    default: 
      return state;
  }
}