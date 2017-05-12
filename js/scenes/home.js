import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Body, Content, Thumbnail, Title, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginActions from '../actions/login';

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
        name: '',
        id: 0,
        email: '',
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({name: nextProps.user.name, id: nextProps.user.id, email: nextProps.user.email})
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white'}} androidStatusBarColor='white'>
          <Image style={{alignSelf: 'center', width: 30, height: 30, resizeMode: 'stretch'}} source={{uri: 'https://image.freepik.com/free-icon/clothes-hanger_318-43294.jpg'}} />
        </Header>
        <Content padder>
          <View>
            <Text>Id: {this.state.id}</Text>
            <Text>Email: {this.state.email}</Text>
            <Text>Name: {this.state.name}</Text>
          </View>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return { 
    user: state.loginReducer.user,
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);