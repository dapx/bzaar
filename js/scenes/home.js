import React, { Component } from 'react';
import { StyleSheet, View, Image, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Thumbnail, Title, Tabs, Tab, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/stores';
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
    }
  }

  componentWillMount(){
    this.props.storeActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps){
    this.setState({name: nextProps.user.name, id: nextProps.user.id, email: nextProps.user.email, jwt: nextProps.jwt, loadingRequest: nextProps.stores.loadingRequest, list: nextProps.stores.list});
  }

  pressItem() {
    this.props.navActions.creditCard();
  }

  renderItem({item, index}) {
    let size = this.state.list.length-1;
    let imageStyle = ((size) == index && this.state.list.length % 2 > 0)
      ? styles.storeUniqueImage
      : styles.storeImage;
    return (
      <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => this.pressItem()}>
        <Image source={{uri: item.logo}} style={imageStyle} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <Container>
        <Header hasTabs style={{ backgroundColor: 'white' }} androidStatusBarColor='black'>
          <Left style={{flex: 1}}>
            <TouchableOpacity onPress={() => this.props.navActions.user()}>
              <Icon style={{color: 'black'}} name='user-circle' />
            </TouchableOpacity>
          </Left>
          <Body style={{flex: 1}}>
            <Image style={{alignSelf: 'center', width: 30, height: 30, resizeMode: 'contain'}} source={require('../../images/header_logo.png')} />
          </Body>
          <Right>
            <TouchableOpacity onPress={() => this.props.navActions.bag()}>
              <Icon style={{color: 'black'}} name='shopping-bag' />
            </TouchableOpacity>
          </Right>
        </Header>
          <Tabs>
            <Tab heading="Lojas">
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
            <Tab heading="Minhas Lojas">
              <Text>Você nao possui lojas cadastradas</Text>
            </Tab>
          </Tabs>
      </Container>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
