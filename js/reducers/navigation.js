import { addNavigationHelpers, NavigationActions } from 'react-navigation';
import { AppNavigator } from '../components/navigation';

const initialState = AppNavigator.router.getStateForAction(AppNavigator.router.getActionForPathAndParams('LoginPage'));

export default function nav(state = initialState, action) {
  switch(action.type){
    case 'Login':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
      //return AppNavigator.router.getStateForAction(action, state);
    case 'Home':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Home' }), state);
    case 'Logout':
      return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
    default:
      return state;
  }
};