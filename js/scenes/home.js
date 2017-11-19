import React, { Component } from 'react';
import { StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Tabs, Tab, Icon, Text, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Products from './products';
import MyStores from './myStores';
import Stores from './Stores';
import * as Actions from '../actions/stores';
import * as NavActions from '../actions/navigation';
import { getDeviceWidth } from '../styles';

const logo = require('../../images/header_logo.png');

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      id: this.props.user.id,
      email: this.props.user.email,
      jwt: this.props.jwt,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.user.name,
      id: nextProps.user.id,
      email: nextProps.user.email,
      jwt: nextProps.jwt,
    });
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: 'white' }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.props.navActions.user()}>
              <Icon style={{ color: 'black' }} name="user-circle-o" />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1 }}>
            <Image
              style={{
                alignSelf: 'center',
                width: 30,
                height: 30,
                resizeMode: 'contain',
              }}
              source={logo}
            />
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.props.navActions.bag()}>
              <Icon style={{ color: 'black' }} name="shopping-bag" />
            </TouchableOpacity>
          </Right>
        </Header>
        <Tabs>
          <Tab heading="Produtos">
            <Products />
          </Tab>
          <Tab heading="Lojas">
            <Stores />
          </Tab>
          <Tab heading="Minhas Lojas">
            <MyStores />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.login.user,
    jwt: state.login.jwt,
    stores: state.stores,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

Home.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    id: PropTypes.number,
    email: PropTypes.string,
  }).isRequired,
  jwt: PropTypes.string.isRequired,
  navActions: PropTypes.shape({
    user: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
