import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import { Container, Content, Toast, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/login';
import * as NavActions from '../actions/navigation';

const logo = require('../../images/login_logo1.png');

class Login extends Component {

  constructor(props) {
    super(props);
    this.logoAnimationValue = new Animated.Value(0.3);
    this.state = {
      email: this.props.email || '',
      password: '',
      pendingRequest: false,
      errorMessage: '',
      jwt: '',
      showToast: false,
    };
  }

  componentDidMount() {
    this.showLogo();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pendingRequest: nextProps.pendingRequest,
      errorMessage: nextProps.errorMessage,
      showToast: nextProps.showToast,
    });
  }

  handleSubmit(email, password) {
    if (email === '' || password === '') {
      Toast.show({
        text: 'Usuário/Senha não informado!',
        position: 'bottom',
        buttonText: 'Okay',
      });
      return;
    }
    this.props.loginActions.login(email, password);
  }

  showLogo() {
    this.logoAnimationValue.setValue(0.5);
    Animated.spring(this.logoAnimationValue,
      {
        toValue: 1,
        friction: 1,
      }).start();
  }

  render() {
    return (
      <Container>
        <Content style={{ backgroundColor: 'white' }} padder>
          <View>
            <Animated.Image
              style={{
                flex: 1,
                alignSelf: 'center',
                marginTop: 20,
                width: 140,
                height: 140,
                transform: [{ scale: this.logoAnimationValue }],
              }}
              source={logo}
            />
            <Text style={{ flex: 1, alignSelf: 'center' }}>Bzaar</Text>
            <Form>
              <Item floatingLabel>
                <Label>E-mail</Label>
                <Icon active name="user" />
                <Input
                  value={this.state.email}
                  onChangeText={email => this.setState({ email })}
                />
              </Item>
              <Item>
                <Icon
                  active
                  name="lock"
                />
                <Input
                  secureTextEntry
                  placeholder="Password"
                  onChangeText={password => this.setState({ password })}
                />
              </Item>
              {this.state.pendingRequest ? (<Spinner />) :
              <View>
                <Button
                  block
                  dark
                  onPress={() => this.handleSubmit(this.state.email, this.state.password)}
                >
                  <Text>Conectar-se</Text>
                </Button>
                <Button transparent block dark onPress={() => this.props.navActions.userRegister()}>
                  <Text>Registrar-se</Text>
                </Button>
              </View>
              }
            </Form>
          </View>
        </Content>
        <Toast
          showToast="true"
          buttonText="Okay"
          buttonPress={() => this.setState({
            showToast: !this.state.showToast,
          })}
          position="bottom"
        >
          <Text>Teste</Text>
        </Toast>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    pendingRequest: state.login.pendingRequest,
    errorMessage: state.login.errorMessage,
    showToast: state.login.showToast,
    jwt: state.login.jwt,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

Login.defaultProps = {
  email: '',
  pendingRequest: false,
  errorMessage: '',
  showToast: false,
};

Login.propTypes = {
  email: PropTypes.string,
  pendingRequest: PropTypes.bool,
  errorMessage: PropTypes.string,
  showToast: PropTypes.bool,
  loginActions: PropTypes.shape({
    login: PropTypes.func.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    userRegister: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
