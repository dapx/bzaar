import React, { Component } from 'react';
import { Alert } from 'react-native';
import { Container, Header, Content, Title, Left, Icon, Text, Button, Spinner, Form, Label, Input, Item, Switch, Body, ListItem, Right } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../../components/headerBack';
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
      isSeller: false,
      pendingConfirmation: false,
      pendingRequest: false,
      errorMessage: '',
      showToast: false,
      active: true,
    };
  }

  componentDidMount() {
    this.setState({
      ...this.props.user,
      pendingRequest: this.props.pendingRequest,
      isSeller: this.props.user.active,
    });
  }

  /*componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.user,
      pendingRequest: nextProps.pendingRequest,
      errorMessage: nextProps.errorMessage,
      showToast: nextProps.showToast,
      isSeller: nextProps.user.active,
    });
  }*/

  handleSubmit() {
    /* eslint-disable no-alert, no-console */
    Alert.alert('TESTE', this.state.name);
    /* eslint-enable no-alert */
  }
  render() {
    return (
      <Container>
        <HeaderBack title="Seu Perfil" back={() => this.props.navActions.back()} />
        <Content style={{ backgroundColor: 'white' }} padder>
        
          <Form style={{flex: 1}}>
            <Item fixedLabel>
              <Label>Nome</Label>
              <Input disabled value={this.state.name} onChangeText={name => this.setState({name})} />
            </Item>
            <Item fixedLabel>
              <Label>Sobrenome</Label>
              <Input disabled value={this.state.surname} onChangeText={surname => this.setState({surname})} />
            </Item>
            <Item fixedLabel>
              <Label>E-mail</Label>
              <Input disabled value={this.state.email} onChangeText={email => this.setState({email})} />
            </Item>
            <ListItem icon>
              <Left><Icon name="smile-o" /></Left>
              <Body>
                <Text>Lojista</Text>
              </Body>
              <Right>
                <Switch disabled value={this.state.isSeller} />
              </Right>
            </ListItem>
            
          {this.state.pendingRequest
            ? <Spinner />
            : <Button block dark disabled onPress={() => this.handleSubmit()}>
              <Text>Salvar</Text>
            </Button>
          }
          </Form>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.login.user,
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
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  pendingRequest: PropTypes.bool,
  errorMessage: PropTypes.string,
  showToast: PropTypes.bool,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  /* registerActions: PropTypes.shape({
    register: PropTypes.func.isRequired,
  }).isRequired,*/
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
