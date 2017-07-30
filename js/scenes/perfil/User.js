import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Content, Title, Left, Icon, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
// import * as Actions from '../../actions/register';
import * as NavActions from '../../actions/navigation';

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      password: '',
      surname: '',
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

  handleSubmit() {
    /* eslint-disable no-alert, no-console */
    Alert.alert('TESTE', this.state.name);
    /* eslint-enable no-alert */
  }
  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="black">
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </Button>
            <Title style={{ color: 'black', alignSelf: 'center' }}>Seu Perfil</Title>
          </Left>
        </Header>
        <Content style={{ backgroundColor: 'white' }} padder>
          <Text>Informacoes de usuário</Text>
          {this.state.pendingRequest
            ? <Spinner />
            : <Button block dark onPress={() => this.handleSubmit()}>
              <Text>Send</Text>
            </Button>
          }
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
    // registerActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

User.propTypes = {
  pendingRequest: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  showToast: PropTypes.bool.isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  /* registerActions: PropTypes.shape({
    register: PropTypes.func.isRequired,
  }).isRequired,*/
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
