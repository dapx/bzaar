import React, { Component } from 'react';
import { StyleSheet, Animated, FlatList, Platform, Text } from 'react-native';
import { Card } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Button from '../components/button';
import List from '../components/list';
import ListItem from '../components/productItem';
import * as Actions from '../actions/products';
import { getDeviceWidth } from '../styles';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  storeImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
  },
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  bar: {
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    resizeMode: 'cover',
  },
});

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
