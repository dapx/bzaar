import React from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { back } from '../actions/navigation';
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
  RegisterPage: { screen: RegisterNavigator,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false
    },
  },
});

class AppWithNavigationState extends React.Component {

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }

    dispatch(back());
    return true;
  };

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
