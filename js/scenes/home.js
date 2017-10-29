import React, { Component } from 'react';
import { StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Tabs, Tab, Icon, Text, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Products from './products';
import MyStores from './myStores';
import * as Actions from '../actions/stores';
import * as NavActions from '../actions/navigation';
import { getDeviceWidth } from '../styles';

const logo = require('../../images/header_logo.png');

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
    resizeMode: 'contain',
  },
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.user.name,
      id: this.props.user.id,
      email: this.props.user.email,
      jwt: this.props.jwt,
      list: this.props.stores.list || [],
      loadingRequest: !!this.props.stores.loadingRequest,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentWillMount() {
    this.props.storeActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.user.name,
      id: nextProps.user.id,
      email: nextProps.user.email,
      jwt: nextProps.jwt,
      loadingRequest: nextProps.stores.loadingRequest,
      list: nextProps.stores.list,
    });
  }

  pressItem(item) {
    this.props.storeActions.openStore(item);
  }

  renderItem({ item, index }) {
    const size = this.state.list.length - 1;
    const imageStyle = (size === index && this.state.list.length % 2 > 0)
      ? styles.storeUniqueImage
      : styles.storeImage;
    return (
      <TouchableOpacity
        key={index}
        style={styles.imageContainer}
        onPress={() => this.pressItem(item)}
      >
        <Image source={{ uri: item.logo }} style={imageStyle} />
      </TouchableOpacity>
    );
  }

  handleRefresh() {
    this.props.storeActions.list(this.props.jwt);
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
            <FlatList
              numColumns={2}
              horizontal={false}
              getItemLayout={(data, index) => ({
                width: styles.storeImage.width,
                height: styles.storeImage.height,
                offset: styles.storeImage.height * index,
                index,
              })
              }
              data={this.state.list}
              renderItem={this.renderItem}
              keyExtractor={item => item.id}
              refreshing={this.state.loadingRequest}
              onRefresh={() => this.handleRefresh()}
              ListEmptyComponent={<Text>Não foi possivel encontrar lojas.</Text>}
            />
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
  stores: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.object),
    loadingRequest: PropTypes.bool,
  }).isRequired,
  storeActions: PropTypes.shape({
    list: PropTypes.func.isRequired,
    openStore: PropTypes.func.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    user: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
