/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import reducer from './reducers/index';
import AppWithNavigationState from './components/navigation';
import { StyleProvider } from 'native-base';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/commonColor';

const loggerMiddleware = createLogger();
let store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

export default class bzaar extends Component {
  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(theme)}>
        <AppWithNavigationState />
        </StyleProvider>
      </Provider>
    );
  }
}