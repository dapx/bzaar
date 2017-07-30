import React from 'react';
import { BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import PropTypes from 'prop-types';
import { back } from '../actions/navigation';
import Login from '../scenes/login';
import Home from '../scenes/home';
import UserRegister from '../scenes/perfil/User';
import Signup from '../scenes/signup';
import CreditCard from '../scenes/perfil/CreditCard';
import Bag from '../scenes/bag';
import Store from '../scenes/store';
import Product from '../scenes/product';

const UserNavigator = StackNavigator({
  User: { screen: UserRegister },
  CreditCardPage: { screen: CreditCard },
});

export const AppNavigator = StackNavigator({
  LoginPage: { screen: Login,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
    },
  },
  HomePage: { screen: Home,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
    },
  },
  UserPage: { screen: UserNavigator,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
    },
  },
  Signup: { screen: Signup,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
    },
  },
  BagPage: { screen: Bag,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
    },
  },
  StorePage: { screen: Store,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
    },
  },
  ProductPage: { screen: Product,
    navigationOptions: {
      visible: false,
      header: null,
      gesturesEnabled: false,
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

  onBackPress() {
    const { dispatch, nav } = this.props;
    if (nav.index === 0) {
      return false;
    }

    dispatch(back());
    return true;
  }

  render() {
    return (
      <AppNavigator navigation={addNavigationHelpers({
        dispatch: this.props.dispatch,
        state: this.props.nav,
      })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.shape({
    index: PropTypes.number.isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      routeName: PropTypes.string,
      type: PropTypes.string,
    })).isRequired,
  }).isRequired,
};

export default connect(mapStateToProps)(AppWithNavigationState);
