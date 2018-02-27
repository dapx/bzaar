import React, { Component } from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { Left, Right, Text, Button, Card, CardItem } from 'native-base';
import PropTypes from 'prop-types';

const CardHeader = props => (
  <CardItem header>
    <Left>
      <Text>{props.item.product_name}</Text>
    </Left>
    <Right>
      <TouchableOpacity onPress={props.onRemove}>
        <Text>X</Text>
      </TouchableOpacity>
    </Right>
  </CardItem>
);

CardHeader.propTypes = {
  item: PropTypes.shape({
    product_name: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

const CardFooter = props => (
  <CardItem footer style={{ justifyContent: 'space-between' }}>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ justifyContent: 'center' }}>
        <Text>
          Qtde.Total: {props.item.quantity}
        </Text>
      </View>
    </View>
    <View style={{ flexDirection: 'row' }}>
      <View style={{ justifyContent: 'center', paddingRight: 10 }}>
        <Text>Total R$: {props.item.product_price}</Text>
      </View>
      <Button small dark>
        <Text>Pedir</Text>
      </Button>
    </View>
  </CardItem>
);

CardFooter.propTypes = {
  item: PropTypes.shape({
    quantity: PropTypes.number.isRequired,
    product_price: PropTypes.number.isRequired,
  }).isRequired,
};

const CardBody = props => (
  <CardItem style={{ flex: 1 }}>
    <Left style={{ flex: 1 }}>
      <Image source={{ uri: props.item.product_image, cache: 'force-cache' }}
        style={{ height: props.imageWidth, width: props.imageWidth }}
      />
    </Left>
    <Left style={{ flex: 3, flexDirection: 'column' }}>
      <Text style={{ fontSize: 18 }}>
        Preço: R$ {props.item.product_price}
      </Text>
      <Text>
        Qtde. Disponível: {props.item.quantity}
      </Text>
    </Left>
  </CardItem>
);

CardBody.propTypes = {
  item: PropTypes.shape({
    product_image: PropTypes.string.isRequired,
    product_price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  imageWidth: PropTypes.number.isRequired,
};

class BagItem extends Component {
  render() {
    return (
      <Card>
        <CardHeader item={this.props.item} onRemove={this.props.onRemove}/>
        <CardBody item={this.props.item} imageWidth={this.props.imageWidth} />
        <CardFooter item={this.props.item} />
      </Card>
    );
  }
}

BagItem.propTypes = {
  item: PropTypes.shape({
    product_image: PropTypes.string.isRequired,
    product_price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    product_name: PropTypes.string,
  }).isRequired,
  imageWidth: PropTypes.number.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default BagItem;
