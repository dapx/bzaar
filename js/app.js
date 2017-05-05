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
import Login from './scenes/login';
import {Scene, Router} from 'react-native-router-flux';
import reducer from './reducers/index'

const loggerMiddleware = createLogger();
let store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

export default class bzaar extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router hideNavBar="true">
          <Scene key="root">
            <Scene key="login" component={Login} title="Login" initial={true}/>
          </Scene>
        </Router>
      </Provider>
    );
  }
}