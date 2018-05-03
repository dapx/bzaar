import React, { Component } from 'react';
import { Container, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import List from '../components/list';
import ListItem from '../components/productEditItem';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import * as StoreActions from '../actions/myStores';

class StoreProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingProducts: props.loadingProducts,
      jwt: props.jwt,
      products: props.products,
      id: props.id,
    };
    this.onPress = this.onPress.bind(this);
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

  onPress(data) {
    this.props.storeActions.editProduct(data);
  }

  render() {
    const data = [
      { id: 0 },
      ...this.props.products,
    ];
    return (
      <Container>
        <HeaderBack title="Produtos" back={this.props.navActions.back} />
        <List
          data={data}
          renderItem={this.renderItem}
          refreshing={this.state.loadingProducts}
          onRefresh={() => this.handleRefresh()}
          onPressItem={this.onPress}
          ListItem={ListItem}
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
    products: state.myStores.products,
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
