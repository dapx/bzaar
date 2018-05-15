import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Container, Content, Left, Icon, Text, Spinner,
  Form, Label, Input, Item, Switch, Body, ListItem, Right,
} from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderBack from '../../components/headerBack';
import Button from '../../components/button';
import * as UserActions from '../../actions/user';
import * as NavActions from '../../actions/navigation';
import IconButton from '../../components/iconButton';
import { ApiUtils } from '../../utils/api';

const Inactive = ({ active, onPress }) => {
  if (!active) {
    return (
      <View style={{
        backgroundColor: '#BF0000',
        borderRadius: 10,
      }}>
        <Button
          onPress={onPress}
        >
          <Text style={{
            color: '#fff',
            margin: 10,
          }}>
            {'Sua conta está inativa!\nClique aqui para re-enviar um e-mail de confirmação.'}
          </Text>
        </Button>
      </View>
    );
  }
  return false;
};

class Address extends React.PureComponent {
  onOpen = () => {
    const { item, onOpen } = this.props;
    onOpen(item);
  }

  onRemove = () => {
    const { item, onRemove } = this.props;
    onRemove(item);
  }

  render() {
    const { item: { id, name, pending } } = this.props;
    const description = (id && !pending) ? '' : 'Pendente\nClique em salvar';
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: 'white',
          borderBottomColor: '#ddd',
          borderBottomWidth: 0.5,
        }}>
        <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
          <Button
            style={{
              flex: 9,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
            onPress={this.onOpen}
          >
            { (!id || pending) && (
              <View style={{ flex: 2, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Icon
                name="alert-circle"
                style={{
                  flex: 1,
                  color: 'gray',
                  fontSize: 20,
                }}
              />
                <Text style={{ flex: 3, fontSize: 8 }}>{description}</Text>
              </View>
            )}
            <Text style={{ flex: 2 }}>{name}</Text>
          </Button>
          <IconButton
            onPress={this.onRemove}
            iconName={'x'}
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
            iconStyle={{ fontSize: 24 }}
          />
        </View>
      </View>
    );
  }
}

Address.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    cep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    uf: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    neighborhood: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    complement: PropTypes.string.isRequired,
    pending: PropTypes.bool,
  }).isRequired,
  onOpen: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

class Addresses extends React.PureComponent {
  onAdd = () => {
    this.props.onAdd();
  }

  render() {
    const { list = [], onAdd, onRemove } = this.props;
    const items = list.map(a => (
      <Address
        key={`address_${a.name}`}
        item={a}
        onOpen={onAdd}
        onRemove={onRemove}
      />
    ));
    return (
      <ScrollView
        style={{
          flex: 1,
          margin: 10,
          marginBottom: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 10,
        }}
      >
      <Button
        style={{
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#ddd',
          alignItems: 'center',
          borderRadius: 20,
          margin: 10,
        }}
        onPress={this.onAdd}
      >
        <Icon
          name={'plus'}
          style={{
            fontSize: 24,
            textAlign: 'center',
            margin: 10,
          }}
          />
        <Text style={{ margin: 10 }}>Adicionar Endereço</Text>
      </Button>
        { items }
      </ScrollView>
    );
  }
}

Addresses.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string.isRequired,
    cep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    uf: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    neighborhood: PropTypes.string.isRequired,
    street: PropTypes.string.isRequired,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    complement: PropTypes.string.isRequired,
    pending: PropTypes.bool,
  })),
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      email: '',
      name: '',
      password: '',
      surname: '',
      shopkeeper: false,
      address: [],
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

  componentWillReceiveProps(nextProps) {
    const {
      user,
      pendingRequest,
    } = nextProps;
    this.setState({ ...user, pendingRequest });
  }

  sendConfirmation = () => {
    const { user: { id }, jwt } = this.props;
    ApiUtils.create(`users/${id}/send_confirmation`, jwt, {});
  }

  handleSubmit() {
    const {
      id, name, surname, address,
    } = this.state;
    const user = {
      id, name, surname, address,
    };
    this.props.userActions.saveUser({ user }, this.props.jwt);
  }

  addAddress = address => this.props.navActions.address(address);

  removeAddress = address => this.props.userActions.removeAddress(address);

  render() {
    const isShopkeeper = this.state.shopkeeper;
    return (
      <Container>
        <HeaderBack title="Seu Perfil" back={() => this.props.navActions.back()} />
        <Content style={{ backgroundColor: 'white' }} padder>
          <Inactive
            onPress={this.sendConfirmation}
            active={this.state.active}
          />
          <Form style={{ flex: 1 }}>
            <Item fixedLabel>
              <Label>Nome</Label>
              <Input
                value={this.state.name}
                onChangeText={name => this.setState({ name })} />
            </Item>
            <Item fixedLabel>
              <Label>Sobrenome</Label>
              <Input
                value={this.state.surname}
                onChangeText={surname => this.setState({ surname })} />
            </Item>
            <Item fixedLabel>
              <Label>E-mail</Label>
              <Input
                disabled
                value={this.state.email}
                onChangeText={email => this.setState({ email })}
              />
            </Item>
            <ListItem icon>
              <Left>
                <Icon
                  name="briefcase"
                  style={{
                    color: 'gray',
                    fontSize: 24,
                  }}
                />
              </Left>
              <Body>
                <Text style={{ color: 'gray' }}>Lojista</Text>
              </Body>
              <Right>
                <Switch disabled={isShopkeeper} value={isShopkeeper} />
              </Right>
            </ListItem>
            <Addresses
              list={this.state.address}
              onAdd={this.addAddress}
              onRemove={this.removeAddress}
            />
          </Form>
        </Content>
        {this.state.pendingRequest
            ? <Spinner />
            : <Button
                style={{
                  height: 50,
                  justifyContent: 'center',
                  backgroundColor: 'black',
                }}
                onPress={() => this.handleSubmit()}>
              <Text style={{
                color: 'white',
                textAlign: 'center',
              }}>
                Salvar
              </Text>
            </Button>
          }
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    user: state.login.user,
    pendingRequest: state.register.pendingRequest,
    errorMessage: state.login.errorMessage,
    showToast: state.login.showToast,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(UserActions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

User.propTypes = {
  jwt: PropTypes.string.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    surname: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    shopkeeper: PropTypes.bool.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string.isRequired,
      cep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      uf: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      neighborhood: PropTypes.string.isRequired,
      street: PropTypes.string.isRequired,
      number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      complement: PropTypes.string.isRequired,
      pending: PropTypes.bool,
    })),
  }).isRequired,
  pendingRequest: PropTypes.bool,
  errorMessage: PropTypes.string,
  showToast: PropTypes.bool,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    address: PropTypes.func.isRequired,
  }).isRequired,
  userActions: PropTypes.shape({
    saveUser: PropTypes.func.isRequired,
    removeAddress: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(User);
