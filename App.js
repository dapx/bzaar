import Expo from "expo";
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Bzaar from './js/app';

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }

  async componentDidMount() {
    await Expo.Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      'FontAwesome': require('native-base/Fonts/FontAwesome.ttf'),
    });
    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady) {
      return <Text>Loading Fonts</Text>;
    }
    return <Bzaar />;
  }

}
