import { RECEIVE_LOGIN, TYPE_EMAIL, TYPE_PASSWORD, REQUEST_LOGIN } from '../actionTypes/login';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { UserService, ApiUtils } from '../utils/api';
import { Toast } from 'native-base';

function request(){
  return {
    type: REQUEST_LOGIN,
  }
}

function receive(data){
  return {
    type: RECEIVE_LOGIN,
    user: data.user,
    jwt: data.jwt
  }
}

export function login(email, password) {
  return dispatch => {
    dispatch(request());
    return UserService.login(email, password)
    .then((data) => {
      dispatch(receive(data));
    })
    .catch((error) => {
      dispatch(receiveError(error.message));
      ApiUtils.error(error.message);
    }).done();
  }
}

export function changingEmailValue(text){
  return {
    type: TYPE_EMAIL,
    text
  }
}

export function changingPasswordValue(text){
  return {
    type: TYPE_PASSWORD,
    text
  }
}

export function receiveError(text){
  return {
    type: RECEIVE_ERROR,
    text
  }
}
