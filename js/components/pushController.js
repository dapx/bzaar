import { Component } from 'react';
import PushNotification from 'react-native-push-notification';

export default class PushController extends Component {
  componentDidMount() {
    PushNotification.configure({
      requestPermissions: true,
      onNotification: notification =>
        console.log('Notification: ', notification),
    });
  }

  render() {
    return null;
  }
}

