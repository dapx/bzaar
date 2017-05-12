import { combineReducers } from 'redux';
import login from '../reducers/login';
import nav from '../reducers/navigation';

export default combineReducers({ nav, login });