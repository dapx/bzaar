import React from 'react';
import { Text, Button as NBButton } from 'native-base';
import PropTypes from 'prop-types';

const FooterButton = ({
  description,
  onConfirm,
  isHide,
  isCancel,
}) => !isHide && (
  <NBButton
    onPress={onConfirm}
    small
    dark
    danger={isCancel}
  >
    <Text>{description}</Text>
  </NBButton>
);

FooterButton.propTypes = {
  description: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  isCancel: PropTypes.bool,
  isHide: PropTypes.bool,
};

export default FooterButton;
