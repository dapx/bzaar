import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { Container, Header, Content, Title, Left, Right, Icon, Text, Button, Card, CardItem, Body } from 'native-base';

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

const CardFooter = props => (
  <CardItem footer style={{justifyContent: 'space-between'}}>
    <View style={{flexDirection: 'row'}}>
      <View style={{justifyContent: 'center'}}>
        <Text>
          Qtde.Total: {props.item.quantity}
        </Text>
      </View>
    </View>
    <View style={{flexDirection: 'row'}}>
      <View style={{justifyContent: 'center', paddingRight: 10}}>
        <Text>Total R$: {props.item.product_price}</Text>
      </View>
      <Button small dark>
        <Text>Pedir</Text>
      </Button>
    </View>
  </CardItem>
);

const CardBody = props => (
  <CardItem style={{flex: 1}}>
    <Left style={{flex: 1}}>
      <Image source={{ uri: props.item.product_image, cache: 'force-cache' }}
        style={{ height: props.imageWidth, width: props.imageWidth }}
      />
    </Left>
    <Left style={{flex: 3, flexDirection: 'column'}}>
      <Text style={{fontSize: 18}}>
        Preço: R$ {props.item.product_price}
      </Text>
      <Text>
        Qtde. Disponível: {props.item.quantity}
      </Text>
    </Left>
  </CardItem>
);

export default class BagItem extends Component {
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