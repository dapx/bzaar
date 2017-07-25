import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Bzaar from './js/app.js';

export default class App extends React.Component {
  render() {
    return (
      <Bzaar />
    );
  }

  async componentDidMount() {
      await Expo.Font.loadAsync({
        'Roboto': require('native-base/Fonts/Roboto.ttf'),
        'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
        'FontAwesome': require('native-base/Fonts/FontAwesome.ttf'),
      });
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
