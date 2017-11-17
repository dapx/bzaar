import {
  RECEIVE_LOGIN,
  REQUEST_LOGIN,
  AUTHORIZE_FACEBOOK,
  AUTHORIZED_FACEBOOK,
} from '../actionTypes/login';
import RECEIVE_ERROR from '../actionTypes/error';
import { UserService, ApiUtils } from '../utils/api';
import { LoginManager, AccessToken } from 'react-native-fbsdk';

export function facebookLogin() {
  return dispatch => {
    dispatch({ type: AUTHORIZE_FACEBOOK });
    LoginManager.logInWithReadPermissions(['email', 'public_profile'])
    .then((result, error) => {
      if (error) {
        ApiUtils.error(error);
      } else if (result.isCancelled) {
        ApiUtils.error('Refused facebook login');
      } else {
        dispatch({
          type: AUTHORIZED_FACEBOOK,
        });
        AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            UserService.loginFacebook(accessToken).then(data => {
              dispatch(receive(data));
            }).catch(error => {
              dispatch(receiveError(error.message));
              ApiUtils.error(error.message);
            });
          }
        );
      }
    }).catch(err => {
      dispatch(receiveError(error.message));
      ApiUtils.error(err.message);
    });
  }
}

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
