import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import BagItem from "../components/bagItem";
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import { getDeviceWidth } from '../styles';

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

  componentDidMount() {
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
      <BagItem
        key={`bag_item_${index}`}
        item={item}
        imageWidth={getDeviceWidth(20)}
        onRemove={() => this.deleteBagItem(item.id)}
      />
    );
  }

  render() {
    return (
      <Container>
        <HeaderBack title="Sacola" back={this.props.navActions.back} />
        <FlatList
              style={{ backgroundColor: 'white' }}
              numColumns={1}
              horizontal={false}
              data={this.state.list}
              renderItem={this.renderItem}
              keyExtractor={item => item.id.toString()}
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
