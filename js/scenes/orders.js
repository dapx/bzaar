import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import Item from '../components/ordersItem';
import * as NavActions from '../actions/navigation';
import * as OrdersActions from '../actions/orders';
import { getDeviceWidth } from '../styles';
import Header from '../components/headerFilter';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingRequest: false,
      list: [],
      jwt: '',
      isOpenedPressed: true,
    };
    this.filters = [
      this.filterClosedStatus,
      this.filterOpenedStatus,
    ];
    this.renderItem = this.renderItem.bind(this);
    this.onConfirmItem = this.onConfirmItem.bind(this);
    this.onCancelItem = this.onCancelItem.bind(this);
    this.changeIsOpened = this.changeIsOpened.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      list: nextProps.list,
      loadingRequest: nextProps.loadingRequest,
      jwt: nextProps.jwt,
    });
  }

  componentDidMount() {
    this.props.ordersActions.listStoreOrders(this.props.jwt, this.props.store.id);
  }

  handleRefresh() {
    this.props.ordersActions.listStoreOrders(this.props.jwt, this.props.store.id);
  }

  changeIsOpened(isOpenedPressed) {
    this.setState({ isOpenedPressed });
  }

  filterClosedStatus(list) {
    return list.filter(item => item.status >= 4);
  }

  filterOpenedStatus(list) {
    return list.filter(item => item.status < 4);
  }

  onConfirmItem(item) {
    const itemCart = {
      item_cart: {
        ...item,
        status: (item.status + 1),
      },
    };
    return this.props.ordersActions.update(this.props.jwt, itemCart, this.props.store.id);
  }

  onCancelItem(item) {
    const itemCart = {
      item_cart: {
        ...item,
        status: 5,
      },
    };
    return this.props.ordersActions.update(this.props.jwt, itemCart, this.props.store.id);
  }

  renderItem({ item, index }) {
    return (
      <Item
        key={`orders_item_${index}`}
        item={item}
        imageWidth={getDeviceWidth(20)}
        onRemove={() => this.deleteBagItem(item.id)}
        onConfirm={this.onConfirmItem}
        onCancel={this.onCancelItem}
      />
    );
  }

  render() {
    const filterType = this.state.isOpenedPressed ? 1 : 0;
    const list = this.filters[filterType](this.state.list);
    return (
      <Container>
        <HeaderBack title="Pedidos" back={this.props.navActions.back} />
        <FlatList
          style={{ backgroundColor: 'white' }}
          numColumns={1}
          horizontal={false}
          data={list}
          renderItem={this.renderItem}
          keyExtractor={item => item.id.toString()}
          refreshing={this.state.loadingRequest}
          onRefresh={() => this.handleRefresh()}
          ListEmptyComponent={<Text>Não foi possivel encontrar pedidos.</Text>}
          ListHeaderComponent={
            <Header
              onPress={this.changeIsOpened}
              isOpenedPressed={this.state.isOpenedPressed}
            />
          }
        />
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    loadingRequest: state.orders.loadingRequest,
    list: state.orders.list,
    store: state.myStores.store,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    ordersActions: bindActionCreators(OrdersActions, dispatch),
  };
}

Orders.propTypes = {
  loadingRequest: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  jwt: PropTypes.string.isRequired,
  store: PropTypes.shape({
    id: PropTypes.number.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  ordersActions: PropTypes.shape({
    listStoreOrders: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Orders);
