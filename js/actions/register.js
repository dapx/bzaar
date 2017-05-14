import { RECEIVE_REGISTER, REQUEST_REGISTER, TYPE_EMAIL, TYPE_NAME, TYPE_SURNAME, TYPE_PASSWORD, TYPE_CONFIRM_PASSWORD } from '../actionTypes/register';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { UserService } from '../utils/api';
import { back } from '../actions/navigation';
import { Toast } from 'native-base';

function request(){
  return {
    type: REQUEST_REGISTER,
  }
}

function receive(data){
  return {
    type: RECEIVE_REGISTER,
  }
}

export function changingEmailValue(text){
  return {
    type: TYPE_EMAIL,
    text
  }
}

export function changingNameValue(text){
  return {
    type: TYPE_NAME,
    text
  }
}

export function changingSurnameValue(text){
  return {
    type: TYPE_SURNAME,
    text
  }
}

export function changingPasswordValue(text){
  return {
    type: TYPE_PASSWORD,
    text
  }
}

export function changingConfirmPasswordValue(text){
  return {
    type: TYPE_CONFIRM_PASSWORD,
    text
  }
}

export function receiveError(text){
  return {
    type: RECEIVE_ERROR,
    text
  }
}

export function register(email, name, surname, password) {
  console.log("REGISTER ACTION");
  return dispatch => {
    console.log("DISPATCHING");
    dispatch(request());
    return UserService.register(email, name, surname, password)
    .then((data) => {
      dispatch(receive(data));
    })
    .catch((error) => {
      dispatch(receiveError(error.message));
    }).done();
  }
}

export function returnPage() {
  return dispatch => dispatch(back());
}