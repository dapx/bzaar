import {
  REQUEST_LOGIN,
  RECEIVE_LOGIN,
  AUTHORIZED_FACEBOOK,
} from '../actionTypes/login';
import RECEIVE_ERROR from '../actionTypes/error';

import {
  ADD_ADDRESS,
  ADDED_ADDRESS,
  SAVE_USER,
  USER_SAVED,
  REMOVED_ADDRESS,
  UPDATED_ADDRESS,
} from '../actionTypes/user';

function address(state = [], action) {
  switch (action.type) {
    case ADD_ADDRESS:
      return [
        ...state,
      ];

    case ADDED_ADDRESS: {
      return [
        ...state,
        action.data,
      ];
    }

    case UPDATED_ADDRESS: {
      const iAddress = state
        .findIndex(a => a.id === action.data.id || a.name === action.data.name);
      return [
        ...state.slice(0, iAddress),
        { ...action.data, pending: true },
        ...state.slice(iAddress + 1),
      ];
    }

    case REMOVED_ADDRESS: {
      const aIndex = state.findIndex(a => a.name === action.data.name);
      return [
        ...state.slice(0, aIndex),
        ...state.slice((aIndex + 1)),
      ];
    }

    default: return state;
  }
}

export function user(state = {}, action) {
  switch (action.type) {
    case SAVE_USER:
      return {
        ...state,
        loading: true,
      };

    case USER_SAVED: {
      return {
        ...state,
        ...action.data,
        loading: false,
      };
    }

    case ADD_ADDRESS:
      return {
        ...state,
        loading: true,
      };

    case UPDATED_ADDRESS:
    case REMOVED_ADDRESS:
    case ADDED_ADDRESS:
      return {
        ...state,
        address: address(state.address, action),
      };

    default: return state;
  }
}


export default function login(state = {}, action) {
  switch (action.type) {
    case SAVE_USER:
    case AUTHORIZED_FACEBOOK:
    case REQUEST_LOGIN:
      return { ...state, pendingRequest: true };
    case RECEIVE_LOGIN:
      return {
        ...state,
        user: action.user,
        jwt: action.jwt,
        pendingRequest: false,
        errorMessage: '',
      };
    case RECEIVE_ERROR:
      return {
        ...state,
        pendingRequest: false,
      };

    case UPDATED_ADDRESS:
    case ADDED_ADDRESS:
    case REMOVED_ADDRESS:
    case USER_SAVED: {
      return {
        ...state,
        user: user(state.user, action),
        pendingRequest: false,
      };
    }

    default:
      return state;
  }
}
