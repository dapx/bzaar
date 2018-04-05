import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import List from '../components/list';
import ListItem from '../components/productItem';
import * as Actions from '../actions/products';

class Products extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      jwt: '',
      loadingRequest: false,
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.productsActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    // TODO - MIGRAR FILTRO PARA O SERVER
    const list = this.filterProductsAvailable(nextProps.list);
    this.setState({
      loadingRequest: nextProps.loadingRequest,
      jwt: nextProps.jwt,
      list,
    });
  }

  onPress(item) {
    this.props.productsActions.showProduct(item);
  }

  filterProductsAvailable(products) {
    return products.filter((product) => {
      const isProductAvailable = this.filterQuantityAvailable(product.sizes).length > 0;
      return isProductAvailable;
    });
  }

  filterQuantityAvailable(sizes) {
    return sizes.filter(size => size.quantity > 0);
  }

  handleRefresh() {
    this.props.productsActions.list(this.props.jwt);
  }

  render() {
    return (
      <List
        ref={(ref) => { this.listRef = ref; }}
        data={this.state.list}
        refreshing={this.state.loadingRequest}
        onRefresh={() => this.handleRefresh()}
        ListEmptyComponent={<Text>Não foi possivel encontrar produtos.</Text>}
        ListItem={ListItem}
        onPressItem={this.onPress}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    list: state.products.list,
    loadingRequest: state.products.loadingRequest,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    productsActions: bindActionCreators(Actions, dispatch),
  };
}

Products.defaultProps = {
  list: [],
  loadingRequest: false,
};

Products.propTypes = {
  jwt: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object),
  loadingRequest: PropTypes.bool,
  productsActions: PropTypes.shape({
    list: PropTypes.func.isRequired,
    showProduct: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
