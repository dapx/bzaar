import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import Button from './button';

const styles = StyleSheet.create({
  selected: {
    backgroundColor: '#ddd',
    borderColor: '#000',
  },
});

class Size extends Component {
  onPress(size) {
    this.props.onPress(size);
  }

  render() {
    const { style, size, selected } = this.props;
    const isActive = selected && styles.selected;
    return (
      <Button onPress={() => this.onPress(size)}>
        <View
          style={[style, isActive]}
        >
        <Text>
          { size.name }
        </Text>
        </View>
      </Button>
    );
  }
}

Size.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  size: PropTypes.shape({
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
};

export default Size;
