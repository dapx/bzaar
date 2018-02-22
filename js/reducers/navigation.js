import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../components/navigation';
import { RECEIVE_LOGIN } from '../actionTypes/login';
import { RECEIVE_REGISTER } from '../actionTypes/register';
import { USER_REGISTER, CREDITCARD_REGISTER, BACK, USER, BAG } from '../actionTypes/navigation';
import { SHOW_PRODUCT, ADDED_PRODUCT_TO_BAG } from '../actionTypes/products';
import { OPEN_STORE } from '../actionTypes/stores';
import { OPEN_MYSTORE, EDIT_STORE, OPEN_NEW_STORE, SAVED_STORE, OPEN_PRODUCTS, EDIT_PRODUCT } from '../actionTypes/myStores';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('LoginPage'));

export default function nav(state = initialState, action) {
  switch (action.type) {
    case 'Login':
    case RECEIVE_REGISTER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'LoginPage' }), state);
    case RECEIVE_LOGIN:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'HomePage' }), state);
    case USER_REGISTER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Signup' }), state);
    case USER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'UserPage' }), state);
    case BAG:
    case ADDED_PRODUCT_TO_BAG:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'BagPage' }), state);
    case CREDITCARD_REGISTER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'CreditCardPage' }), state);
    case SAVED_STORE:
    case BACK:
      return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
    case OPEN_STORE:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'StorePage' }), state);
    case OPEN_MYSTORE:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'MyStorePage' }), state);
    case OPEN_NEW_STORE:
    case EDIT_STORE:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'StoreEditPage' }), state);
    case SHOW_PRODUCT:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'ProductPage' }), state);
    case OPEN_PRODUCTS:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'StoreProductsPage' }), state);
    case EDIT_PRODUCT:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'ProductEditPage' }), state);
    default:
      return state;
  }
}
