import React, { Component } from 'react';
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Thumbnail, Title, Tabs, Tab, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/store';
import * as NavActions from '../actions/navigation';
import { getDeviceWidth } from '../styles';

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
  },
  storeImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    resizeMode: 'contain',
  },
  storeUniqueImage: {
    width: getDeviceWidth(100),
    height: getDeviceWidth(35),
    resizeMode: 'stretch',
  }
});

class Store extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.store.id,
      name: this.props.store.name,
      logo: this.props.store.logo,
      email: this.props.store.email,
      description: this.props.store.description,
      list: this.props.store.list || [],
      jwt: this.props.jwt,
      loadingRequest: !!this.props.store.loadingRequest,
    }
  }

  componentWillMount(){
    this.props.storeActions.listProductsByStore(this.props.jwt, this.props.store.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({name: nextProps.store.name, id: nextProps.store.id, email: nextProps.store.email, loadingRequest: nextProps.store.loadingRequest, list: nextProps.store.list, jwt: nextProps.jwt});
  }

  pressItem() {
    this.props.navActions.creditCard();
  }

  renderItem({item, index}) {
    return (
      <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => this.pressItem()}>
        <Text>Item: {item.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: 'white' }} androidStatusBarColor='black'>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navActions.back()}>
              <Icon style={{color: 'black'}} name='arrow-left' />
            </TouchableOpacity>
          </Left>
          <Body style={{flex: 1}}>
            <Image style={{alignSelf: 'center', width: 50, height: 50, resizeMode: 'contain'}} source={{uri: this.props.store.logo}} />
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.props.navActions.bag()}>
              <Icon style={{color: 'black'}} name='shopping-bag' />
            </TouchableOpacity>
          </Right>
        </Header>
          <Tabs>
            <Tab heading="Todos">
            { !!this.state.loadingRequest
              ? <Spinner />
              : <FlatList
                  numColumns={2}
                  horizontal={false}
                  getItemLayout={(data, index) => (
                    {width: styles.storeImage.width, height: styles.storeImage.height, offset: styles.storeImage.height * index, index}
                  )}
                  data={this.state.list}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={item => item.id} />
            }
            </Tab>
          </Tabs>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    store: state.store,
    jwt: state.login.jwt
   };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);
