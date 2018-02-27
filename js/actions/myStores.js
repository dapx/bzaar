import * as Actions from '../actionTypes/myStores';
import RECEIVE_ERROR from '../actionTypes/error';
import { ApiUtils } from '../utils/api';

function request() {
  return {
    type: Actions.REQUEST_MYSTORES,
  };
}

function receive(data) {
  return {
    type: Actions.RECEIVE_MYSTORES,
    ...data,
  };
}

function receiveError(error) {
  return {
    type: Actions.RECEIVE_ERROR,
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
  return dispatch => dispatch({ type: Actions.OPEN_MYSTORE, store });
}

export function openNewStore() {
  const store = {
    id: 0,
    name: '',
    description: '',
    logo: '',
    email: '',
  };
  return dispatch => dispatch({ type: Actions.OPEN_NEW_STORE, store });
}

export function editStore(store) {
  return dispatch => dispatch({ type: Actions.EDIT_STORE, store });
}

export function openProducts(storeId) {
  return dispatch => dispatch({ type: Actions.OPEN_PRODUCTS, storeId });
}

export function editProduct(product) {
  return dispatch => dispatch({ type: Actions.EDIT_PRODUCT, product });
}

export function editProductImages(product) {
  return dispatch => dispatch({ type: Actions.EDIT_PRODUCT_IMAGES, product });
}

function requestImage() {
  return {
    type: Actions.REQUEST_IMAGE,
  };
}

function receiveImage(storeId, data) {
  return {
    type: Actions.RECEIVE_IMAGE,
    id: storeId,
    data,
  };
}

function uploadImage() {
  return {
    type: Actions.UPLOAD_IMAGE,
  };
}

function uploadedImage() {
  return {
    type: Actions.UPLOADED_IMAGE,
  };
}

export function requestStoreSignedURL(jwt, metaData, store) {
  return (dispatch) => {
    dispatch(requestImage());
    return ApiUtils.create(`stores/${store.id}/upload_image`, jwt, metaData)
      .then((data) => {
        dispatch(receiveImage(store.id, data));
        return data;
      }).catch(error => ApiUtils.error(error.message));
  };
}

export function requestProductSignedURL(jwt, metaData, product) {
  return (dispatch) => {
    dispatch(requestImage());
    return ApiUtils.create(
      `stores/${product.store_id}/products/${product.id}/product_image/upload`,
      jwt,
      metaData,
      ).then((data) => {
        dispatch(receiveImage(product.id, data));
        return data;
      }).catch(error => ApiUtils.error(error.message));
  };
}

export function sendImage(signedURL, imageData, mimetype) {
  return (dispatch) => {
    dispatch(uploadImage());
    return ApiUtils.upload(signedURL, imageData, mimetype)
    .then(() => dispatch(uploadedImage()))
    .catch((error) => {
      dispatch(uploadedImage());
      ApiUtils.error(`Não foi possivel enviar a imagem: ${error}`);
    });
  };
}

function saveStore() {
  return {
    type: Actions.SAVE_STORE,
  };
}

function savedStore(data) {
  return {
    type: Actions.SAVED_STORE,
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
    return ApiUtils.create('stores', jwt, storeData, method = 'POST')
      .then(data => dispatch(savedStore(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

function requestProducts() {
  return {
    type: Actions.REQUEST_PRODUCTS,
  };
}

function receiveProducts(data) {
  return {
    type: Actions.RECEIVE_PRODUCTS,
    ...data,
  };
}

export function listProducts(jwt, storeId) {
  return (dispatch) => {
    dispatch(requestProducts());
    return ApiUtils.request(`stores/${storeId}/products`, jwt)
      .then(data => dispatch(receiveProducts(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

function saveProduct() {
  return {
    type: Actions.SAVE_PRODUCT,
  };
}

function savedProduct(data) {
  return {
    type: Actions.SAVED_PRODUCT,
    data,
  };
}

export function updateProduct(jwt, productData) {
  return (dispatch) => {
    dispatch(saveProduct());
    return ApiUtils.create(`stores/${productData.id}`, jwt, productData, method = 'PUT')
      .then(data => dispatch(savedProduct(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}

export function createProduct(jwt, productData) {
  return (dispatch) => {
    dispatch(saveStore());
    return ApiUtils.create('stores', jwt, productData, method = 'POST')
      .then(data => dispatch(savedStore(data)))
      .catch(error => ApiUtils.error(error.message));
  };
}
