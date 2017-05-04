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
import { createStore } from 'redux';
import Login from './scenes/login';
import {Scene, Router} from 'react-native-router-flux';
import reducer from './reducers/index'

let store = createStore(reducer);

export default class bzaar extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Scene key="root">
            <Scene key="login" component={Login} title="Login" initial={true}/>
          </Scene>
        </Router>
      </Provider>
    );
  }
}