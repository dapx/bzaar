import React from 'react';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import Login from '../scenes/login';
import Home from '../scenes/home';

export const AppNavigator = StackNavigator({
   LoginPage: { screen: Login },
   HomePage: { screen: Home }
}, { headerMode: 'screen' });

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
