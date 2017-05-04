import { combineReducers } from 'redux';

export default combineReducers({ reducer: simpleReducer });

function simpleReducer(state = [], action){
    return state;
}