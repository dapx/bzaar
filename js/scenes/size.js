import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Form, Item, Input, Label, Button, Text } from 'native-base';
import PropTypes from 'prop-types';
import QuantityInput from '../components/quantityInput';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import { ApiUtils } from '../utils/api';

class SizeModal extends Component {
  constructor(props) {
    super(props);
    const maskedPrice = this.maskPrice(props.size.price);
    this.state = {
      ...props.size,
      maskedPrice,
    };
    this.onPlus = this.onPlus.bind(this);
    this.onMinus = this.onMinus.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeQuantity = this.onChangeQuantity.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
  }

  onPlus() {
    const quantity = this.state.quantity + 1;
    this.onChangeQuantity(quantity);
  }

  onMinus() {
    const quantity = this.state.quantity - 1;
    this.onChangeQuantity(quantity);
  }

  onChangeName(value) {
    const name = value && value.toUpperCase();
    this.setState({ name });
  }

  onChangeQuantity(value) {
    const quantity = value > 0 ? parseInt(value, 10) : 0;
    this.setState({ quantity });
  }

  normalizeValue(value) {
    return value.replace(/[^0-9-]/g, '');
  }

  maskPrice(price = 0) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  onChangePrice(value) {
    // To work with cents
    const price = this.normalizeValue(value) / 100;
    const maskedPrice = this.maskPrice(price);
    this.setState({ price, maskedPrice });
  }

  onSubmit(data) {
    const isDuplicated = !data.id && this.props.sizes.find(size => size.name === data.name);
    if (isDuplicated) {
      ApiUtils.error('Nome de tamanho já existe.');
      return;
    }
    this.props.storesActions.addSize(data);
  }

  render() {
    const {
      id, name, quantity, price, maskedPrice,
    } = this.state;
    const disabled = !name || (price < 1);
    return (
      <ScrollView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{
            textAlign: 'center',
            fontSize: 30,
            margin: 40,
          }}>Defina o Tamanho</Text>
        </View>
        <View style={{ flex: 4 }}>
        <Form style={{ marginBottom: 20 }}>
            <Item inlineLabel>
              <Label>Tamanho:</Label>
              <Input
                onChangeText={this.onChangeName}
                value={name}
              />
            </Item>
            <QuantityInput
              inputProps={{ keyboardType: 'numeric' }}
              onChange={this.onChangeQuantity}
              onPlus={this.onPlus}
              onMinus={this.onMinus}
              value={quantity}
            />
            <Item inlineLabel last>
              <Label>Preço:</Label>
              <Input
                keyboardType={'numeric'}
                onChangeText={this.onChangePrice}
                value={`${maskedPrice}`}
              />
            </Item>
          </Form>
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <Button
                style={{ margin: 5 }}
                onPress={
                  () => this.onSubmit({
                    id,
                    name,
                    quantity,
                    price,
                  })
                }
                block
                dark
                disabled={disabled}
              >
                <Text>{ id ? 'Voltar' : 'Adicionar'}</Text>
              </Button>
              <Button
                style={{ margin: 5 }}
                block
                light
                onPress={this.props.navActions.back}
              >
                <Text>Cancelar</Text>
              </Button>
            </View>
          </View>
      </ScrollView>
    );
  }
}

SizeModal.propTypes = {
  size: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  sizes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    quantity: PropTypes.number,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  })),
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }),
  storesActions: PropTypes.shape({
    addSize: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    size: state.myStores.size,
    sizes: state.myStores.product.sizes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    storesActions: bindActionCreators(StoresActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SizeModal);
