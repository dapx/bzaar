import {
  REQUEST_MYSTORES,
  RECEIVE_MYSTORES,
  OPEN_MYSTORE,
  EDIT_STORE,
  OPEN_NEW_STORE,
  RECEIVE_IMAGE,
  UPLOAD_IMAGE,
  UPLOADED_IMAGE,
  SAVE_STORE,
  SAVED_STORE,
  REQUEST_PRODUCTS,
  RECEIVE_PRODUCTS,
  EDIT_PRODUCT,
  EDIT_PRODUCT_IMAGES,
  EDIT_SIZE,
  ADD_SIZE,
  REMOVE_SIZE,
  SAVED_PRODUCT,
  PRODUCT_CHANGED,
  RECEIVE_PRODUCT_IMAGES,
} from '../actionTypes/myStores';

const INITIAL_STATE = {
  loadingRequest: false,
  list: [],
  store: {},
  products: [],
  product: {},
  size: {},
};

function sizes(state = [], action) {
  switch (action.type) {

    case ADD_SIZE: {
      const cleanState = state.filter(item => (
        item.id
          ? item.id !== action.size.id
          : item.name !== action.size.name
      ));
      return [
        ...cleanState,
        action.size,
      ];
    }

    case REMOVE_SIZE: {
      return state.filter(size => size.name !== action.size.name);
    }

    default:
      return state;
  }
}

function imagesToSave(state = [], action) {
  switch (action.type) {

    case RECEIVE_PRODUCT_IMAGES: {
      const listWithoutNewSequence = state.filter(image => image.sequence !== action.sequence);
      const { path, mimetype } = action.metaData;
      const { signed_url, image_url } = action.data;
      return [
        ...listWithoutNewSequence,
        { url: image_url, sequence: action.sequence, signed_url, path, mimetype },
      ];
    }

    default:
      return state;
  }
}

function images(state = [], action) {
  switch (action.type) {

    case RECEIVE_PRODUCT_IMAGES: {
      const listWithoutNewSequence = state.filter(image => image.sequence !== action.sequence);
      const { path } = action.metaData;
      return [
        ...listWithoutNewSequence,
        { url: path, sequence: action.sequence },
      ];
    }

    default:
      return state;
  }
}

function product(state = {}, action) {
  switch (action.type) {

    case PRODUCT_CHANGED:
    case EDIT_PRODUCT_IMAGES:
    case EDIT_PRODUCT:
      return {
        ...state,
        ...action.data,
        imagesToSaved: [],
      };

    case SAVED_PRODUCT:
      return {
        ...state,
        ...action.data,
      };

    case REMOVE_SIZE:
    case ADD_SIZE:
      return {
        ...state,
        sizes: sizes(state.sizes, action),
      };

    case RECEIVE_PRODUCT_IMAGES:
      return {
        ...state,
        images: images(state.images, action),
        imagesToSave: imagesToSave(state.imagesToSave, action),
      };

    default:
      return state;
  }
}

function products(state = [], action) {
  switch (action.type) {
    case SAVED_PRODUCT: {
      const cleanState = state.filter(item => item.id !== action.data.id);
      return [
        ...cleanState,
        action.data,
      ];
    }

    default:
      return state;
  }
}

function store(state = {}, action) {
  switch (action.type) {
    case RECEIVE_IMAGE: {
      const presigned_url = action.data.signed_url;
      const image_path = action.data.image_path;
      const image_url = action.data.image_url;
      return {
        ...state,
        presigned_url,
        image_url,
        image_path,
      };
    }

    case UPLOAD_IMAGE:
      return {
        ...state,
        uploading: true,
      };

    case UPLOADED_IMAGE:
      return {
        ...state,
        logo: state.image_url,
        uploading: false,
      };

    case SAVE_STORE:
      return {
        ...state,
        loadingRequest: true,
      };

    case EDIT_STORE:
    case OPEN_MYSTORE:
    case OPEN_NEW_STORE:
    case SAVED_STORE: {
      return {
        ...state,
        ...action.data,
        loadingRequest: false,
      };
    }

    default:
      return state;
  }
}

function list(state = [], action) {
  switch (action.type) {
    case SAVED_STORE: {
      const cleanState = state.filter(item => item.id !== action.data.id);
      return [
        ...cleanState,
        action.data,
      ];
    }

    default:
      return state;
  }
}

export default function stores(state = INITIAL_STATE, action) {
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

    // STORE CHANGES
    case EDIT_STORE:
    case OPEN_MYSTORE:
    case OPEN_NEW_STORE:
    case UPLOAD_IMAGE:
    case UPLOADED_IMAGE:
    case SAVE_STORE:
    case SAVED_STORE:
    case RECEIVE_IMAGE: {
      return {
        ...state,
        store: store(state.store, action),
        list: list(state.list, action),
      };
    }

    // SIZE CHANGES
    case EDIT_SIZE:
      return {
        ...state,
        size: action.size,
      };

    // PRODUCT CHANGES
    case RECEIVE_PRODUCT_IMAGES:
    case PRODUCT_CHANGED:
    case EDIT_PRODUCT_IMAGES:
    case EDIT_PRODUCT:
    case REMOVE_SIZE:
    case ADD_SIZE:
    case SAVED_PRODUCT:
      return {
        ...state,
        product: product(state.product, action),
        products: products(state.products, action),
      };

    default:
      return state;
  }
}
