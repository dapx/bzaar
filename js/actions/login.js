import { RECEIVE_LOGIN, REQUEST_LOGIN } from '../actionTypes/login';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { UserService, ApiUtils } from '../utils/api';

function request() {
  return {
    type: REQUEST_LOGIN,
  };
}

function receive(data) {
  return {
    type: RECEIVE_LOGIN,
    user: data.user,
    jwt: data.jwt,
  };
}

function receiveError(text) {
  return {
    type: RECEIVE_ERROR,
    text,
  };
}

export function login(email, password) {
  return (dispatch) => {
    dispatch(request());
    return UserService.login(email, password)
    .then(data => dispatch(receive(data)))
    .catch((error) => {
      dispatch(receiveError(error.message));
      ApiUtils.error(error.message);
    }).done();
  };
}
