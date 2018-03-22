import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Container, Text, Card } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import HeaderBack from '../components/headerBack';
import Button from '../components/button';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import * as StoreActions from '../actions/myStores';
import { getDeviceWidth } from '../styles';

const styles = StyleSheet.create({
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
  },
});

class StoreProducts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loadingProducts: props.loadingProducts,
      jwt: props.jwt,
      products: props.products,
      id: props.id,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.storeActions.listProducts(this.props.jwt, this.props.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      jwt: nextProps.jwt,
      products: nextProps.products,
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
    let uri = 'https://png.icons8.com/dusk/1600/new-product.png';
    let name = 'Adicionar';
    let itemToOpen = { id: 0, name: '', description: '', sizes: [], images: [] };
    const isNew = item.id === 0;
    if (!isNew) {
      const image = item.images[0];
      name = item.name;
      uri = (image && image.url) || 'https://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder.png';
      itemToOpen = item;
    }
    return (
      <Button
        key={`product-store-${index}`}
        style={{ flex: 1 }}
        onPress={() => this.onPress(itemToOpen)}
      >
        <Card>
          <FastImage
            style={styles.storeUniqueImage}
            source={{ uri }}
            resizeMode={'contain'}
          />
          <Text style={{ textAlign: 'center' }}>{`${name}`}</Text>
        </Card>
      </Button>
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
          data={[
            { id: 0 },
            ...this.state.products,
          ]}
          renderItem={this.renderItem}
          keyExtractor={item => (item ? `${item.id}` : 'fake')}
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
