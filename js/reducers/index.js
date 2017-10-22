import { combineReducers } from 'redux';
import login from './login';
import nav from './navigation';
import stores from './stores';
import products from './products';
import store from './store';
import register from './register';
import bag from './bag';

export default combineReducers({
  nav,
  login,
  stores,
  products,
  register,
  store,
  bag,
});
