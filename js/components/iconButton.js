import React from 'react';
import { View } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import Button from './button';

const IconButton = ({ style, onPress, iconName, iconStyle }) => {
  return (
    <Button
      onPress={onPress}
      style={style}
    >
      <Icon
        style={iconStyle}
        name={iconName}
      />
    </Button>
  );
};

IconButton.propTypes = {
  style: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  iconStyle: Icon.propTypes.style,
};

export default IconButton;
