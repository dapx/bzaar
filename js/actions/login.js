import { LoginManager, AccessToken } from 'react-native-fbsdk';
import {
  RECEIVE_LOGIN,
  REQUEST_LOGIN,
  AUTHORIZE_FACEBOOK,
  AUTHORIZED_FACEBOOK,
} from '../actionTypes/login';
import RECEIVE_ERROR from '../actionTypes/error'
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


export function facebookLogin() {
  return (dispatch) => {
    dispatch({ type: AUTHORIZE_FACEBOOK });
    LoginManager.logInWithReadPermissions(['email', 'public_profile'])
      .then((result, error) => {
        if (error) {
          ApiUtils.error(error);
          dispatch({ type: RECEIVE_ERROR });
        } else if (result.isCancelled) {
          ApiUtils.error('Refused facebook login');
        } else {
          dispatch({
            type: AUTHORIZED_FACEBOOK,
          });
          AccessToken.getCurrentAccessToken().then((data) => {
            const accessToken = data.accessToken.toString();
            UserService.loginFacebook(accessToken).then((auth) => {
              dispatch(receive(auth));
            }).catch((err) => {
              dispatch({ type: RECEIVE_ERROR });
              ApiUtils.error(err.message);
            });
          });
        }
      }).catch((err) => {
        dispatch({ type: RECEIVE_ERROR });
        ApiUtils.error(err.message);
      });
  };
}

export function login(email, password) {
  return (dispatch) => {
    dispatch(request());
    return UserService.login(email, password)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        dispatch({ type: RECEIVE_ERROR });
        ApiUtils.error(error.message);
      })
      .done();
  };
}
