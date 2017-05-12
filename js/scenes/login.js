import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Body, Content, Thumbnail, Toast, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginActions from '../actions/login';

class Login extends Component {
  static navigationOptions = {
    header: null,
  }
  
  constructor(props){
    super(props);
    this.state = {
        email: '',
        password: '',
        pendingLoginRequest: false,
        errorMessage: '',
        jwt: '',
        showToast: false
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({email: nextProps.email, password: nextProps.password, pendingLoginRequest: nextProps.pendingLoginRequest, errorMessage: nextProps.errorMessage, showToast: nextProps.showToast})
  }

  _handleSubmit(email, password) {
    if (email === '' || password === ''){
      Toast.show({
        text: 'Usuário/Senha não informado!',
        position: 'bottom',
        buttonText: 'Okay'
      });
      return;
    }
    this.props.login(email, password);
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
        <Content padder>
          <View>
            <Image style={{flex: 1, alignSelf: 'center', width: 100, height: 100}} source={{uri: 'https://image.freepik.com/free-icon/clothes-hanger_318-43294.jpg'}} />
          <Form>
            <Item floatingLabel>
              <Label>E-mail</Label>
              <Icon active name='person' />
              <Input
                value={this.state.email}
                onChangeText={(email) => this.props.changingEmailValue(email)}
               />
            </Item>
            <Item>
              <Icon active name='lock' />
              <Input secureTextEntry
                placeholder="Password"
                onChangeText={(password) => this.props.changingPasswordValue(password)}
               />
            </Item>
            {this.state.pendingLoginRequest ? (<Spinner />) :
            <View>
              <Button block dark onPress={() => this._handleSubmit(this.state.email, this.state.password)}>
                <Text>Sign-in</Text>
              </Button>
              <Button transparent block dark>
                <Text>Sign-up</Text>
              </Button>
            </View>
            }
          </Form>
          </View>
        </Content>
        <Toast
          showToast="true"
          buttonText="Okay"
          buttonPress={()=> this.setState({
            showToast: !this.state.showToast
          })}
          position="bottom">
          <Text>Teste</Text>
        </Toast>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return { 
    pendingLoginRequest: state.login.pendingLoginRequest,
    email: state.login.email,
    password: state.login.password,
    errorMessage: state.login.errorMessage,
    showToast: state.login.showToast,
    jwt: state.login.jwt
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);