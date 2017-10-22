import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Image, View } from 'react-native';
import { Container, Header, Content, Title, Left, Right, Icon, Text, Button, Card, CardItem, Body } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import { getDeviceWidth } from '../styles';

const styles = StyleSheet.create({
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

class Bag extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingRequest: false,
      list: [],
      jwt: '',
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list,
      loadingRequest: nextProps.loadingRequest,
      jwt: nextProps.jwt,
    });
  }

  componentWillMount() {
    this.props.bagActions.listBagItems(this.props.jwt);
  }

  handleRefresh() {
    this.props.bagActions.listBagItems(this.props.jwt);
  }

  deleteBagItem(productId) {
    this.props.bagActions.removeBagItem(this.props.jwt, productId);
  }

  renderItem({ item, index }) {
    return (
      <Card style={{flex: 0}}>
      <CardItem header>
        <Left>
          <Text>{item.product_name}</Text>
        </Left>
        <Right>
          <TouchableOpacity onPress={() => this.deleteBagItem(item.id)}>
            <Text>X</Text>
          </TouchableOpacity>
        </Right>
      </CardItem>
      <CardItem style={{flex: 1}}>
          <Left style={{flex: 1}}>
            <Image source={{uri: item.product_image}}
              style={{height: getDeviceWidth(20), width: getDeviceWidth(20)}}
            />
          </Left>

          <Left style={{flex: 3, flexDirection: 'column'}}>
            <Text style={{fontSize: 18}}>
              Preço: R$ {item.product_price}
            </Text>
            <Text>
              Qtde. Disponível: {item.quantity}
            </Text>
          </Left>
      </CardItem>
      <CardItem footer style={{justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'center'}}>
            <Text>
              Qtde.Total: {item.quantity}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <View style={{justifyContent: 'center', paddingRight: 10}}>
            <Text>Total R$: {item.product_price}</Text>
          </View>
          <Button small dark>
            <Text>Pedir</Text>
          </Button>
        </View>
      </CardItem>
      </Card>
    );
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="black">
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </Button>
            <Title style={{ color: 'black', alignSelf: 'center' }}>Sacola de Compras</Title>
          </Left>
        </Header>
        <FlatList
              style={{ backgroundColor: 'white' }}
              numColumns={1}
              horizontal={false}
              data={this.state.list}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              refreshing={this.state.loadingRequest}
              onRefresh={() => this.handleRefresh()}
              ListEmptyComponent={<Text>Não foi possivel encontrar produtos em seu carrinho.</Text>}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    loadingRequest: state.bag.loadingRequest,
    list: state.bag.list,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    bagActions: bindActionCreators(ProductsActions, dispatch),
  };
}

Bag.propTypes = {
  loadingRequest: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  jwt: PropTypes.string.isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  bagActions: PropTypes.shape({
    listBagItems: PropTypes.func.isRequired,
    removeBagItem: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Bag);
