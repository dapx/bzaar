import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { Container, Header, Body, Content, Thumbnail, Toast, Form, Title, Item, Label, Left, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CreditCard from 'react-native-credit-card';
import * as Actions from '../../actions/register';
import * as NavActions from '../../actions/navigation';

class CreditCardPage extends Component {
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
              <Icon style={{color: 'black'}} name='arrow-left' />
            </Button>
            <Title style={{color: 'black', alignSelf: 'center'}}>Cadastrar Cartão de Crédito</Title>
          </Left>
        </Header>
        <Content style={{backgroundColor: 'white'}} padder>
          <Form>
            <Item style={{justifyContent: 'center', alignItems: 'center'}}>
              <CreditCard 
                 type={this.state.type}
                 imageFront={require('../../../images/card-front.png')}
                 imageBack={require('../../../images/card-back.png')}
                 shiny={false}
                 bar={false}
                 focused={this.state.focused}
                 number={this.state.creditNumber}
                 name={this.state.name}
                 expiry={this.state.expiry}
                 cvc={this.state.cvc}/>
            </Item>
            <Item>
              <Input
                value={this.state.name}
                placeholder="Complete name"
                onChangeText={(name) => this.setState({name})}
              />
            </Item>
            <Item>
              <Input
                value={this.state.creditNumber}
                placeholder="number"
                onChangeText={(creditNumber) => this.setState({creditNumber})}
              />
            </Item>
            <Item>
              <Input
              value={this.state.cvc}
              placeholder="number"
              onChangeText={(cvc) => this.setState({cvc: cvc})}
              />
            </Item>
            {this.state.pendingRequest ? (<Spinner />) :
            <Button block dark onPress={() => this._handleSubmit(this.state.email, this.state.name, this.state.password, this.state.confirmPassword)}>
              <Text>Send</Text>
            </Button>
            }
          </Form>
        </Content>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return { 
    pendingRequest: state.register.pendingRequest,
    cvc: state.register.cvc,
    creditNumber: state.register.creditNumber,
    showToast: state.login.showToast,
   };
}

function mapDispatchToProps(dispatch) {
  return {
    registerActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreditCardPage);