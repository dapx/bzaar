/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { StyleProvider, Root } from 'native-base';
import codePush from 'react-native-code-push';
import {
  createReactNavigationReduxMiddleware,
  createReduxBoundAddListener,
} from 'react-navigation-redux-helpers';
import reducer from './reducers/index';
import AppWithNavigationState from './components/navigation';
import PushController from './components/pushController';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/commonColor';
// import PushNotification from 'react-native-push-notification';

const navMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav,
);
export const addListener = createReduxBoundAddListener('root');

const loggerMiddleware = createLogger();
const store = createStore(reducer, applyMiddleware(
  thunkMiddleware,
  loggerMiddleware,
  navMiddleware,
));


const codePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
};

class Bzaar extends Component {
  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  componentWillUnmount() {
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange(appState) {
    if (appState == 'background') {
      /**PushNotification.localNotificationSchedule({
        message: "Volta aqui!!!", // (required)
        date: new Date(Date.now() + (1 * 1000)) // in 60 secs
      });
      console.log('The app is in background');
      */
    }
  }

  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(theme)}>
          <Root>
            <AppWithNavigationState />
            <PushController />
          </Root>
        </StyleProvider>
      </Provider>
    );
  }
}

export default codePush(codePushOptions)(Bzaar);
