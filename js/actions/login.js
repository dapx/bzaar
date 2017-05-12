import * as action from '../actionTypes/login';
import { UserService } from '../utils/api';
import { Actions } from 'react-native-router-flux';
import { Toast } from 'native-base';

function requestLogin(){
  return {
    type: action.REQUEST_LOGIN,
  }
}

function receiveLogin(data){
  return {
    type: action.RECEIVE_LOGIN,
    user: data.user,
    jwt: data.jwt
  }
}

export function login(email, password) {
  return dispatch => {
    dispatch(requestLogin());
    return UserService.userLogin(email, password)
    .then((data) => {
      dispatch(receiveLogin(data));
    })
    .catch((error) => {
      dispatch(receiveError(error.message));
    }).done();
  }
}

export function changingEmailValue(text){
  return {
    type: action.TYPE_EMAIL,
    text
  }
}

export function changingPasswordValue(text){
  return {
    type: action.TYPE_PASSWORD,
    text
  }
}

export function receiveError(text){
  return {
    type: action.RECEIVE_ERROR,
    text
  }
}