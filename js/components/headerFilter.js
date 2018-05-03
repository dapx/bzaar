import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Button from '../components/button';

const styles = {
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    margin: 5,
  },
  headerContainerTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd',
    padding: 5,
  },
  headerButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    color: 'black',
  },
  activeButton: {
    fontWeight: 'bold',
  },
};

export default class Header extends React.PureComponent {
  render() {
    const { onPress, isOpenedPressed } = this.props;
    return (
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Button
            style={styles.headerButton}
            onPress={() => onPress(true)}
          >
            <View style={{ padding: 5 }}>
              <Text style={[
                styles.headerButtonText,
                isOpenedPressed ? styles.activeButton : null,
              ]}>
                Aberto
              </Text>
            </View>
          </Button>
          <Button
            style={styles.headerButton}
            onPress={() => onPress(false)}
          >
            <View style={{ padding: 5 }}>
              <Text style={[
                styles.headerButtonText,
                !isOpenedPressed ? styles.activeButton : null,
              ]}>
                Concluído
              </Text>
            </View>
          </Button>
        </View>
      </View>
    );
  }
}

Header.propTypes = {
  onPress: PropTypes.func.isRequired,
  isOpenedPressed: PropTypes.bool.isRequired,
};
