import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Item, Label, Button, Input, Text } from 'native-base';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  input: { flex: 1 },
  btnContainer: {
    flex: 6,
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  button: {
    flex: 2,
    justifyContent: 'center',
    marginHorizontal: 1,
  },
});

const QuantityInput = props => (
  <Item inlineLabel>
  <Label>Quantidade:</Label>
    <Input
      {...props.inputProps}
      style={styles.input}
      onChangeText={props.onChange}
      value={`${props.value}`}
    />
    <View style={styles.btnContainer}>
    <Button
      style={styles.button}
      onPress={props.onPlus}>
      <Text>
        {'+'}
      </Text>
    </Button>
    <Button
      style={styles.button}
      onPress={props.onMinus}>
      <Text>
        {'-'}
      </Text>
    </Button>
  </View>
  </Item>
);

QuantityInput.propTypes = {
  inputProps: PropTypes.object,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onPlus: PropTypes.func.isRequired,
  onMinus: PropTypes.func.isRequired,
};

export default QuantityInput;
