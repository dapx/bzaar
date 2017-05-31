import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import Login from '../scenes/login';
import Home from '../scenes/home';
import UserRegister from '../scenes/register/UserRegister';
import CreditCardRegister from '../scenes/register/CreditCardRegister';

const RegisterNavigator = StackNavigator({
  UserPage: { screen: UserRegister },
  CreditCardPage: { screen: CreditCardRegister },
});

export const AppNavigator = StackNavigator({
  LoginPage: { screen: Login },
  HomePage: { screen: Home,
  navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false
    },
  },
  RegisterPage: { screen: RegisterNavigator },
});

class AppWithNavigationState extends React.Component {
  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })} />
    );
  }
}

const mapStateToProps = (state) => ({
  nav: state.nav
});

export default connect(mapStateToProps)(AppWithNavigationState);
