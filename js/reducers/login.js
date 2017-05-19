import {
  TYPE_EMAIL,
  TYPE_PASSWORD,
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
} from '../actionTypes/login'
//import { RECEIVE_REGISTER } from '../actionTypes/register';
import { RECEIVE_ERROR } from '../actionTypes/error';

export default function login(state = {}, action) {
  switch(action.type){
    case TYPE_EMAIL:
      return {...state, email: action.text}
    case TYPE_PASSWORD:
      return {...state, password: action.text}
    case REQUEST_LOGIN:
      return {...state, pendingRequest: true}
    case RECEIVE_LOGIN:
      return {...state,
         user: action.user,
         jwt: action.jwt,
         pendingRequest: false,
         errorMessage: ''
        }
    case RECEIVE_ERROR:
      return {...state,
         pendingRequest: false,
         showToast: true,
         errorMessage: action.text
      }
    /* Disabled due by bug in floating label input
    case RECEIVE_REGISTER:
      return {...state,
        email: action.email,
        password: action.password
      }
    */
    default: 
      return state;
  }
}