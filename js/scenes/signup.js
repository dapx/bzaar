import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Header, Content, Toast, Form, Title, Item, Left, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/register';
import * as NavActions from '../actions/navigation';

const InputItem = props => (
  <Item>
    <Input {...props} />
  </Item>
);

class Signup extends Component {

  constructor(props) {
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
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pendingRequest: nextProps.pendingRequest,
      errorMessage: nextProps.errorMessage,
      showToast: nextProps.showToast,
    });
  }

  handleSubmit(email, name, surname, password, confirmPassword) {
    if (email === '' || password === '' || name === '') {
      Toast.show({
        text: 'Existe campos não preenchidos!',
        position: 'bottom',
        buttonText: 'Okay',
      });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({
        text: 'As senhas não conferem!',
        position: 'bottom',
        buttonText: 'Okay',
      });
      return;
    }
    this.props.registerActions.register(email, name, surname, password);
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }}>
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </Button>
            <Title style={{ color: 'black', alignSelf: 'center' }}>Cadastrar</Title>
          </Left>
        </Header>
        <Content style={{ backgroundColor: 'white' }} padder>
          <View>
            <Form>
              <InputItem
                value={this.state.email}
                placeholder="E-mail"
                onChangeText={email => this.setState({ email })}
              />
              <InputItem
                value={this.state.name}
                placeholder="Name"
                onChangeText={name => this.setState({ name })}
              />
              <InputItem
                value={this.state.surname}
                placeholder="Surname"
                onChangeText={surname => this.setState({ surname })}
              />
              <InputItem
                secureTextEntry
                placeholder="Password"
                onChangeText={password => this.setState({ password })}
              />
              <InputItem
                secureTextEntry
                placeholder="Confirm Password"
                onChangeText={confirmPassword => this.setState({ confirmPassword })}
              />
              { this.state.pendingRequest
              ? <Spinner />
              : <Button
                block
                dark
                onPress={() => this.handleSubmit(
                  this.state.email,
                  this.state.name,
                  this.state.surname,
                  this.state.password,
                  this.state.confirmPassword,
                  )}
              >
                <Text>Send</Text>
              </Button>
              }
            </Form>
          </View>
        </Content>
      </Container>
    );
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
    registerActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

Signup.propTypes = {
  pendingRequest: PropTypes.bool,
  errorMessage: PropTypes.string,
  showToast: PropTypes.bool,
  registerActions: PropTypes.shape({
    register: PropTypes.func.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
