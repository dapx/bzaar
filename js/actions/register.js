import { RECEIVE_REGISTER, REQUEST_REGISTER } from '../actionTypes/register';
import RECEIVE_ERROR from '../actionTypes/error';
import { UserService, ApiUtils } from '../utils/api';

function request() {
  return {
    type: REQUEST_REGISTER,
  };
}

function receive(data, email, password) {
  return {
    type: RECEIVE_REGISTER,
    email,
    password,
  };
}

function receiveError(text) {
  return {
    type: RECEIVE_ERROR,
    text,
  };
}

export function register(email, name, surname, password) {
  return (dispatch) => {
    dispatch(request());
    return UserService.register(email, name, surname, password)
    .then(data => dispatch(receive(data, email, password)))
    .catch((error) => {
      dispatch(receiveError(error.message));
      ApiUtils.error(error.message);
    })
    .done();
  };
}
