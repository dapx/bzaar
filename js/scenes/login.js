import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Header, Body, Content, Thumbnail, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as LoginActions from '../actions/login';

class Login extends Component {
  constructor(props){
    super(props);
    this.state = {
        email: '',
        password: '',
        pendingLoginRequest: false,
    }
  }
  
  componentWillReceiveProps(nextProps){
    this.setState({email: nextProps.email, password: nextProps.password, pendingLoginRequest: nextProps.pendingLoginRequest})
  }

  _handleSubmit(email, password) {
    if (email === '' || password === ''){
      Alert.alert('Erro','Usuário/Senha não informado!');
      return;
    }
    this.props.login(email, password);
  }

  render() {
    return (
      <Container>
        <Content padder>
          {this.state.pendingLoginRequest ? (<Spinner />) :
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
            <Button block dark onPress={() => this._handleSubmit(this.state.email, this.state.password)}>
              <Text>Sign-in</Text>
            </Button>
            <Button transparent block dark>
              <Text>Sign-up</Text>
            </Button>
          </Form>
          </View>
          }
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  console.log(state.loginReducer.email);
  return { 
    pendingLoginRequest: state.loginReducer.pendingLoginRequest,
    email: state.loginReducer.email,
    password: state.loginReducer.password
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);