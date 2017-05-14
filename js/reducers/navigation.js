import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { AppNavigator } from '../components/navigation';
import { TYPE_EMAIL, TYPE_PASSWORD, REQUEST_LOGIN, RECEIVE_LOGIN, RECEIVE_ERROR } from '../actionTypes/login.js'

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('LoginPage'));

export default function nav(state = initialState, action) {
  switch(action.type){
    case 'Login':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'LoginPage' }), state);
    case RECEIVE_LOGIN:
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'HomePage' }), state);
    case 'Logout':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'LoginPage' }), state);
    default:
      return state;
  }
};