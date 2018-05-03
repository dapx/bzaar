import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#f0f',
    borderRadius: 10,
  },
  sizes: {
    padding: 5,
  },
  close: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ddd',
    borderBottomLeftRadius: 5,
    borderTopLeftRadius: 5,
  },
  add: {
    marginLeft: 15,
    marginRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  text: {
    color: '#fff',
  },
});

class SizePicker extends Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);
  }

  renderItem({ item, index }) {
    return item ? (
      <View
        key={`size-${index}`}
        style={styles.container}
      >
      <TouchableOpacity onPress={() => this.props.onClose(item)}>
        <View style={styles.close}>
          <Text style={styles.text}>x</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => this.props.onEdit(item)}>
        <View style={styles.sizes}>
          <Text style={styles.text}>{`${item.name} - R$${item.price}`}</Text>
        </View>
      </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        key={`size-${index}`}
        onPress={() => this.props.onEdit({ name: '', quantity: 0, price: 0 })}
      >
        <View style={styles.add}>
          <Text style={styles.text}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ marginBottom: 10 }}>
        <FlatList
          data={[
            false,
            ...this.props.sizes,
          ]}
          keyExtractor={item => (item ? item.name : 'fake')}
          renderItem={this.renderItem}
          horizontal
        />
      </View>
    );
  }
}

SizePicker.propTypes = {
  sizes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })).isRequired,
  onClose: PropTypes.func,
  onEdit: PropTypes.func,
};

export default SizePicker;
