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

const changeStatus = {
  0: 1,
  1: 0,
  3: 4,
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
    return list.filter(item => item.status >= 4);
  }

  filterOpenedStatus(list) {
    return list.filter(item => item.status < 4);
  }

  onConfirmItem(item, address) {
    if (item.status !== 3 && !(item.status <= 1)) return;
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
          ListEmptyComponent={<Text style={{ margin: 10, textAlign: 'center' }}>Não foi possivel encontrar itens.</Text>}
          ListHeaderComponent={
            <Header
              onPress={this.changeIsOpened}
              isOpenedPressed={this.state.isOpenedPressed}
            />}
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
