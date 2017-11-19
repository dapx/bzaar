import {
  REQUEST_MYSTORES,
  RECEIVE_MYSTORES,
  OPEN_MYSTORE,
  EDIT_STORE,
  OPEN_PRODUCTS,
  OPEN_NEW_STORE,
  REQUEST_IMAGE,
  RECEIVE_IMAGE,
  UPLOAD_IMAGE,
  UPLOADED_IMAGE,
  SAVE_STORE,
  SAVED_STORE,
 } from '../actionTypes/myStores';
import { RECEIVE_ERROR } from '../actionTypes/error';
import { ApiUtils } from '../utils/api';

function request() {
  return {
    type: REQUEST_MYSTORES,
  };
}

function receive(data) {
  return {
    type: RECEIVE_MYSTORES,
    ...data,
  };
}

function receiveError(error) {
  return {
    type: RECEIVE_ERROR,
    error,
  };
}

export function list(jwt) {
  return (dispatch) => {
    dispatch(request());
    return ApiUtils.request('my_stores', jwt)
      .then(data => dispatch(receive(data)))
      .catch((error) => {
        dispatch(receiveError(error.message));
        ApiUtils.error(error.message);
      })
      .done();
  };
}

export function openStore(store) {
  return dispatch => dispatch({ type: OPEN_MYSTORE, store });
}

export function openNewStore() {
  const store = {
    id: 0,
    name: '',
    description: '',
    logo: '',
    email: '',
  }
  return dispatch => dispatch({ type: OPEN_NEW_STORE, store });
}

export function editStore(store) {
  return dispatch => dispatch({ type: EDIT_STORE, store });
}

export function openProducts(store_id) {
  return dispatch => dispatch({ type: OPEN_PRODUCTS, store_id });
}

function requestImage() {
  return {
    type: REQUEST_IMAGE,
  };
}

function receiveImage(storeId, data) {
  return {
    type: RECEIVE_IMAGE,
    id: storeId,
    data,
  };
}

function uploadImage() {
  return {
    type: UPLOAD_IMAGE,
  }
}

function uploadedImage() {
  return {
    type: UPLOADED_IMAGE,
  }
}

export function requestSignedURL(jwt, metaData) {
  return (dispatch) => {
    dispatch(requestImage());
    return ApiUtils.create(`stores/${metaData.id}/upload_image`, jwt, metaData)
      .then(data => {
        dispatch(receiveImage(metaData.id, data));
        return data;
      }).catch(error => {
        ApiUtils.error(error.message);
      });
  }
}

export function sendImage(signedURL, imageData, mimetype) {
  return (dispatch) => {
    dispatch(uploadImage());
    return ApiUtils.upload(signedURL, imageData, mimetype)
    .then(response => dispatch(uploadedImage()))
    .catch(error => {
      dispatch(uploadedImage());
      ApiUtils.error('Não foi possivel enviar a imagem.')
    });
  };
}

function saveStore() {
  return {
    type: SAVE_STORE,
  };
}

function savedStore(data) {
  return {
    type: SAVED_STORE,
    data,
  };
}

export function updateStore(jwt, storeData) {
  return (dispatch) => {
    dispatch(saveStore());
    return ApiUtils.create(`stores/${storeData.store.id}`, jwt, storeData, method = 'PUT')
      .then(data => dispatch(savedStore(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

export function createStore(jwt, storeData) {
  return (dispatch) => {
    dispatch(saveStore());
    return ApiUtils.create(`stores`, jwt, storeData, method = 'POST')
      .then(data => dispatch(savedStore(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}
