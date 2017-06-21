import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Body, Content, Thumbnail, Toast, Form, Title, Item, Label, Left, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreditCard from 'react-native-credit-card';
import * as Actions from '../actions/register';
import * as NavActions from '../actions/navigation';

class Bag extends Component {
  static navigationOptions = {
    header: null,
  }
  
  constructor(props){
    super(props);
    this.state = {
        pendingRequest: false,
        errorMessage: '',
        showToast: false,
        number: '',
        cvc: '',
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({
      pendingRequest: nextProps.pendingRequest, errorMessage: nextProps.errorMessage,
      showToast: nextProps.showToast})
  }

   _showErrorMessage(message){
    if (message !== ''){
      Toast.show({
        text: message,
        type: 'warning',
        duration: 10000,
        position: 'bottom',
        buttonText: 'Okay'
      });
    }
  }

  render() {
    return (
      <Container>
        <Header style={{backgroundColor: 'white'}} androidStatusBarColor='black'>
          <Left style={{flexDirection: 'row'}}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{color: 'black'}} name='arrow-left' />
            </Button>
            <Title style={{color: 'black', alignSelf: 'center'}}>Sacola de Compras</Title>
          </Left>
        </Header>
        <Content style={{backgroundColor: 'white'}} padder>
          <Text>Nenhum item na sacola</Text>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return { 
    pendingRequest: state.register.pendingRequest,
    errorMessage: state.login.errorMessage,
    showToast: state.login.showToast,
   };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bag);