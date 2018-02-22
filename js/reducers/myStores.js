import {
  REQUEST_MYSTORES,
  RECEIVE_MYSTORES,
  OPEN_MYSTORE,
  EDIT_STORE,
  OPEN_NEW_STORE,
  REQUEST_IMAGE,
  RECEIVE_IMAGE,
  UPLOAD_IMAGE,
  UPLOADED_IMAGE,
  SAVE_STORE,
  SAVED_STORE,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  EDIT_PRODUCT,
} from '../actionTypes/myStores';

function store(state = {}, action) {
  switch (action.type) {
    case RECEIVE_IMAGE:
      const presigned_url = action.data.signed_url;
      const image_path = action.data.image_path;
      const image_url = action.data.image_url;
      return {
        ...state,
        presigned_url,
        image_url,
        image_path,
      };

    case UPLOAD_IMAGE:
      return {
        ...state,
        uploading: true,
      };

    case UPLOADED_IMAGE:
      return {
        ...state,
        uploading: false,
        logo: state.image_url,
      };

    case SAVE_STORE:
      return {
        ...state,
        loadingRequest: true,
      }

    case SAVED_STORE:
      const storeUpdated = action.data;
      return {
        ...state,
        ...storeUpdated,
        loadingRequest: false,
      }

    default:
      return state;
  }
}

export default function stores(state = {}, action) {
  switch (action.type) {

    case REQUEST_MYSTORES:
      return {
        ...state,
        loadingRequest: true,
      };

    case RECEIVE_MYSTORES:
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    case EDIT_STORE:
    case OPEN_MYSTORE:
    case OPEN_NEW_STORE: {
      return {
        ...state,
        store: action.store,
      };
    }

    case UPLOAD_IMAGE:
    case UPLOADED_IMAGE:
    case SAVE_STORE:
    case SAVED_STORE:
    case RECEIVE_IMAGE: {
      const newStore = store(state.store, action);
      return {
        ...state,
        store: newStore,
      };
    }

    case RECEIVE_PRODUCTS:
      return {
        ...state,
        products: action.data,
        loadingProducts: false,
      };

    case REQUEST_PRODUCTS:
      return {
        ...state,
        loadingProducts: true,
      };

    case EDIT_PRODUCT:
      console.log("action.product ", action.product);
      return {
        ...state,
        product: action.product,
      };

    default:
      return state;
  }
}
