import { REQUEST_STORES, RECEIVE_STORES } from '../actionTypes/stores';

export default function stores(state = {}, action){
  console.log("STORES_REDUCER");
  switch(action.type){
    case REQUEST_STORES:
      console.log('REQUEST_STORES###################################################')
      return {
        ...state,
        loadingRequest: true,
      };
    case RECEIVE_STORES:
      console.log('RECEIVE_STORES###################################################')
      console.log(action);
      return {
        ...state,
        list: action.data,
        loadingRequest: false,
      };

    default:
      console.log('DEFAULT##########################################################')
      return state;
  }
}