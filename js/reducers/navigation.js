import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../components/navigation';
import { RECEIVE_LOGIN } from '../actionTypes/login';
import { RECEIVE_REGISTER } from '../actionTypes/register';
import { USER_REGISTER, CREDITCARD_REGISTER, BACK, USER, BAG, PRODUCT } from '../actionTypes/navigation';
import { OPEN_STORE } from '../actionTypes/stores';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('LoginPage'));

export default function nav(state = initialState, action) {
  switch (action.type) {
    case 'Login':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'LoginPage' }), state);
    case RECEIVE_LOGIN:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'HomePage' }), state);
    case USER_REGISTER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Signup' }), state);
    case USER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'UserPage' }), state);
    case BAG:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'BagPage' }), state);
    case CREDITCARD_REGISTER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'CreditCardPage' }), state);
    case BACK:
      return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
    case RECEIVE_REGISTER:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'LoginPage' }), state);
    case OPEN_STORE:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'StorePage' }), state);
    case PRODUCT:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'ProductPage' }), state);
    default:
      return state;
  }
}
