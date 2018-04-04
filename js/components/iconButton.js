import React from 'react';
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
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  onPress: PropTypes.func.isRequired,
  iconName: PropTypes.string.isRequired,
  iconStyle: Icon.propTypes.style,
};

export default IconButton;
