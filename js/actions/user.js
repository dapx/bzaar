import {
  SAVE_USER,
  USER_SAVED,
  ADD_ADDRESS,
  REMOVED_ADDRESS,
  ADDED_ADDRESS,
  UPDATED_ADDRESS,
} from '../actionTypes/user';
import { ApiUtils } from '../utils/api';
import RECEIVE_ERROR from '../actionTypes/error';

export function requestAddress(userId, address, jwt) {
  return (dispatch) => {
    dispatch({ type: ADD_ADDRESS });
    return ApiUtils.create(`user/${userId}/address`, jwt, address)
      .then((data) => {
        dispatch({ type: ADDED_ADDRESS, ...data });
      });
  };
}

export function addAddress(address) {
  return (dispatch) => {
    dispatch({ type: ADDED_ADDRESS, data: address });
  };
}

export function updateAddress(address) {
  return (dispatch) => {
    dispatch({ type: UPDATED_ADDRESS, data: address });
  };
}

export function removeAddress(address) {
  return (dispatch) => {
    dispatch({ type: REMOVED_ADDRESS, data: address });
  };
}

export function saveUser(user, jwt) {
  const { user: { id } } = user;
  return (dispatch) => {
    dispatch({ type: SAVE_USER });
    return ApiUtils.create(`users/${id}`, jwt, user, 'PUT')
      .then((data) => {
        dispatch({ type: USER_SAVED, ...data });
        ApiUtils.success('Salvo com sucesso!');
      })
      .catch((err) => {
        dispatch({ type: RECEIVE_ERROR });
        ApiUtils.error(`Ocorreu um erro: ${err.message}`);
      });
  };
}
