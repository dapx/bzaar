import {
  TYPE_EMAIL,
  TYPE_PASSWORD,
  REQUEST_LOGIN,
  RECEIVE_LOGIN
} from '../actionTypes/login';
import { UserService } from '../utils/api';

function requestLogin(){
  return {
    type: REQUEST_LOGIN,
  }
}

function receiveLogin(data){
  return {
    type: RECEIVE_LOGIN,
    user: data.user,
    jwt: data.jwt
  }
}

export function login(email, password) {
  return dispatch => {
    dispatch(requestLogin());
    return UserService.userLogin(email, password)
    .then((data) => dispatch(receiveLogin(data)))
    .catch((error) => {
      console.error('Ocorreu um erro ao realizar o Login do usuario');
      console.error(error);
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