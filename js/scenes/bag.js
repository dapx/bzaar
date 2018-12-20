import React, { Component } from 'react';
import { FlatList } from 'react-native';
import { Container, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import BagItem from '../components/bagItem';
import * as NavActions from '../actions/navigation';
import * as BagActions from '../actions/bag';
import { getDeviceWidth } from '../styles';
import Header from '../components/headerFilter';
import { ITEM_STATUS } from '../utils/constants';

/**
 * Cart button actions based on current actual state
 * It map the current state to the next state.
 *
 * Diagram:
 * current_state => next_state
 *
 */
const changeStatus = {
  0: ITEM_STATUS.BUY_REQUESTED,
  1: ITEM_STATUS.IN_BAG,
  3: ITEM_STATUS.DELIVERED,
  6: ITEM_STATUS.DELIVERED,
};

class Bag extends Component {
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
    this.props.bagActions.listBagItems(this.props.jwt);
  }

  handleRefresh() {
    this.props.bagActions.listBagItems(this.props.jwt);
  }

  deleteBagItem(productId) {
    this.props.bagActions.deleteItem(this.props.jwt, productId);
  }

  changeIsOpened(isOpenedPressed) {
    this.setState({ isOpenedPressed });
  }

  filterClosedStatus(list) {
    return list.filter(item => item.status >= ITEM_STATUS.DELIVERED
      && item.status !== ITEM_STATUS.IN_LOCO);
  }

  filterOpenedStatus(list) {
    return list.filter(item => item.status < ITEM_STATUS.DELIVERED
      || item.status === ITEM_STATUS.IN_LOCO);
  }

  onConfirmItem(item, address) {
    if (item.status !== ITEM_STATUS.WAITING_DELIVERY &&
      !(item.status <= ITEM_STATUS.BUY_REQUESTED) &&
      item.status !== ITEM_STATUS.IN_LOCO) return;
    const itemCart = {
      item_cart: {
        ...item,
        address,
        status: changeStatus[item.status],
      },
    };
    this.props.bagActions.confirmOrder(this.props.jwt, itemCart);
  }

  renderItem({ item, index }) {
    return (
      <BagItem
        key={`bag_item_${index}`}
        item={item}
        addresses={this.props.addresses}
        imageWidth={getDeviceWidth(20)}
        onRemove={() => this.deleteBagItem(item.id)}
        onConfirm={this.onConfirmItem}
      />
    );
  }

  render() {
    const filterType = this.state.isOpenedPressed ? 1 : 0;
    const list = this.filters[filterType](this.state.list);
    return (
      <Container>
        <HeaderBack title="Sacola" back={this.props.navActions.back} />
        <FlatList
          style={{ backgroundColor: 'white' }}
          numColumns={1}
          horizontal={false}
          data={list}
          renderItem={this.renderItem}
          keyExtractor={item => item.id.toString()}
          refreshing={this.state.loadingRequest}
          onRefresh={() => this.handleRefresh()}
          ListEmptyComponent={
            <Text style={{ margin: 10, textAlign: 'center' }}>
              Não foi possivel encontrar itens.
            </Text>
          }
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
    addresses: state.login.user.address,
    loadingRequest: state.bag.loadingRequest,
    list: state.bag.list,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    bagActions: bindActionCreators(BagActions, dispatch),
  };
}

Bag.propTypes = {
  loadingRequest: PropTypes.bool.isRequired,
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
  jwt: PropTypes.string.isRequired,
  addresses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })),
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  bagActions: PropTypes.shape({
    listBagItems: PropTypes.func.isRequired,
    deleteItem: PropTypes.func.isRequired,
    confirmOrder: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Bag);
