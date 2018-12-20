import React from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import 'moment/locale/pt-br';

moment.locale('pt-br');

const CardStatus = ({
  status,
  color,
  isHide,
  updatedAt,
}) => !isHide && (
  <View style={{ flex: 1 }}>
    <View style={{ backgroundColor: color }}>
      <Text>{`${status} - ${moment(updatedAt).fromNow()}`}</Text>
    </View>
  </View>
);

CardStatus.propTypes = {
  status: PropTypes.string.isRequired,
  updatedAt: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  isHide: PropTypes.bool.isRequired,
};

export default CardStatus;
