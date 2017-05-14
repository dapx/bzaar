import React, { Component } from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { Container, Header, Body, Content, Thumbnail, Title, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/stores';

class Home extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props){
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
    this.props.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps){
    this.setState({name: nextProps.user.name, id: nextProps.user.id, email: nextProps.user.email, jwt: nextProps.jwt, loadingRequest: nextProps.stores.loadingRequest, list: nextProps.stores.list});
  }

  renderItem({item, index}) {
    return <Text>{item.name}</Text>;
  }

  render() {
    console.log("RENDER");
    console.log(!!this.state.loadingRequest);
    console.log(this.state.list);
    return (
      <Container>
        <Header style={{ backgroundColor: 'white'}} androidStatusBarColor='white'>
          <Image style={{alignSelf: 'center', width: 30, height: 30, resizeMode: 'stretch'}} source={require('../../images/header_logo.png')} />
        </Header>
        <Content padder>
          <View>
            <Text>Id: {this.state.id}</Text>
            <Text>Email: {this.state.email}</Text>
            <Text>Name: {this.state.name}</Text>
          </View>
          { !!this.state.loadingRequest 
            ? <Text>Loading..</Text>
            : <FlatList
                data={this.state.list}
                renderItem={this.renderItem}
                keyExtractor={item => item.name} />
          }
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  console.log("MAP STATE TO PROPS ######################################################");
  console.log(state);
  return { 
    user: state.login.user,
    jwt: state.login.jwt,
    stores: state.stores,
   };
}

function mapDispatchToProps(dispatch) {
  console.log("HOME - MAP DISPATCH TO PROPS");
  console.log(dispatch.constructor);
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);