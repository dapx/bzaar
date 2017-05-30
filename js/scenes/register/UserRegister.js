import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Body, Content, Thumbnail, Toast, Form, Title, Item, Label, Left, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreditCard from 'react-native-credit-card';
import * as Actions from '../../actions/register';
import * as NavActions from '../../actions/navigation';

class UserRegister extends Component {
  static navigationOptions = {
    header: null,
  }
  
  constructor(props){
    super(props);
    this.state = {
        email: '',
        name: '',
        password: '',
        surname: '',
        confirmPassword: '',
        pendingRequest: false,
        errorMessage: '',
        showToast: false,
        number: '',
        cvc: '',
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({
      email: nextProps.email, name: nextProps.name, surname: nextProps.surname,
      password: nextProps.password, confirmPassword: nextProps.confirmPassword,
      pendingRequest: nextProps.pendingRequest, errorMessage: nextProps.errorMessage,
      showToast: nextProps.showToast})
  }

  _handleSubmit(email, name, password, confirmPassword) {
    if (email === '' || password === '' || name === ''){
      Toast.show({
        text: 'Existe campos não preenchidos!',
        position: 'bottom',
        buttonText: 'Okay'
      });
      return;
    }
    if (password !== confirmPassword){
      Toast.show({
        text: 'As senhas não conferem!',
        position: 'bottom',
        buttonText: 'Okay'
      });
      return;
    }
    this.props.registerActions.register(email, name, password);
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
              <Icon style={{color: 'black'}} name='arrow-back' />
            </Button>
            <Title style={{color: 'black', alignSelf: 'center'}}>Register</Title>
          </Left>
        </Header>
        <Content style={{backgroundColor: 'white'}} padder>
          <View>
          <Form>
            <Item>
              <Input
                value={this.state.email}
                placeholder="E-mail"
                onChangeText={(email) => this.props.registerActions.changingEmailValue(email)}
               />
            </Item>
            <Item>
              <Input
                value={this.state.name}
                placeholder="Name"
                onChangeText={(name) => this.props.registerActions.changingNameValue(name)}
               />
            </Item>
            <Item>
              <Input
                value={this.state.surname}
                placeholder="Surname"
                onChangeText={(surname) => this.props.registerActions.changingSurnameValue(surname)}
               />
            </Item>
            <Item>
              <Input secureTextEntry
                placeholder="Password"
                onChangeText={(password) => this.props.registerActions.changingPasswordValue(password)}
               />
            </Item>
            <Item>
              <Input secureTextEntry
                placeholder="Confirm Password"
                onChangeText={(confirmPassword) => this.props.registerActions.changingConfirmPasswordValue(confirmPassword)}
               />
            </Item>
            {this.state.pendingRequest ? (<Spinner />) :
            <Button block dark onPress={() => this._handleSubmit(this.state.email, this.state.name, this.state.password, this.state.confirmPassword)}>
              <Text>Send</Text>
            </Button>
            }
          </Form>
          </View>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return { 
    pendingRequest: state.register.pendingRequest,
    email: state.register.email,
    name: state.register.name,
    surname: state.register.surname,
    password: state.register.password,
    confirmPassword: state.register.confirmPassword,
    errorMessage: state.login.errorMessage,
    showToast: state.login.showToast,
   };
}

function mapDispatchToProps(dispatch) {
  return {
    registerActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserRegister);