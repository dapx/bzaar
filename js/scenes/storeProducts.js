import React, { Component } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Container, Text, Card } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import * as StoreActions from '../actions/myStores';
import { getDeviceWidth } from '../styles';

const styles = StyleSheet.create({
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

class StoreProducts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      loadingProducts: false,
      products: [],
      jwt: '',
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.storeActions.listProducts(this.props.jwt, this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      jwt: nextProps.jwt,
      products: [
        {
          id: 0,
          image: 'https://png.icons8.com/dusk/1600/new-product.png',
          name: 'adicionar',
          description: '',
          price: 0,
          store_id: 0,
        },
        ...nextProps.products,
      ],
      loadingProducts: nextProps.loadingProducts,
      id: nextProps.id,
    });
  }

  handleRefresh() {
    this.props.storeActions.listProducts(this.state.jwt, this.state.id);
  }

  onPress(product) {
    this.props.storeActions.editProduct(product);
  }

  renderItem({ item, index }) {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => this.onPress(item)}
      >
        <Card key={`product-store-${index}`}>
          <Image style={styles.storeUniqueImage} source={{ uri: item.image, cache: 'force-cache' }} />
          <Text style={{ textAlign: 'center' }}>{`${item.name}`}</Text>
        </Card>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container>
        <HeaderBack title="Produtos" back={this.props.navActions.back} />
        <FlatList
          style={{ backgroundColor: 'white' }}
          numColumns={2}
          horizontal={false}
          data={this.state.products}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          refreshing={this.state.loadingProducts}
          onRefresh={() => this.handleRefresh()}
          ListEmptyComponent={<Text>Não foi possivel encontrar produtos na sua loja.</Text>}
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    loadingProducts: !!state.myStores.loadingProducts,
    products: state.myStores.products || [],
    id: state.myStores.store.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    productsActions: bindActionCreators(ProductsActions, dispatch),
    storeActions: bindActionCreators(StoreActions, dispatch),
  };
}

StoreProducts.propTypes = {
  loadingProducts: PropTypes.bool.isRequired,
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
  jwt: PropTypes.string.isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  storeActions: PropTypes.shape({
    listProducts: PropTypes.func.isRequired,
    editProduct: PropTypes.func.isRequired,
  }).isRequired,
  id: PropTypes.number.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreProducts);
