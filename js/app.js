/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { StyleProvider, Root } from 'native-base';
import reducer from './reducers/index';
import AppWithNavigationState from './components/navigation';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/commonColor';

const loggerMiddleware = createLogger();
const store = createStore(reducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

const bzaar = () => (
  <Provider store={store}>
    <StyleProvider style={getTheme(theme)}>
      <Root>
        <AppWithNavigationState />
      </Root>
    </StyleProvider>
  </Provider>
);

export default bzaar;
