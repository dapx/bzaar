import { combineReducers } from 'redux';
import login from '../reducers/login';
import nav from '../reducers/navigation';
import stores from '../reducers/stores';

export default combineReducers({
   nav,
   login,
   stores
});