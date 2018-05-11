import React, { Component } from 'react';
import { ScrollView, View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Content, Form, Item, Input, Label, Button, Text, Picker, Icon } from 'native-base';
import PropTypes from 'prop-types';
import IconButton from '../components/iconButton';
import * as NavActions from '../actions/navigation';
import * as UserActions from '../actions/user';
import { UserService, ApiUtils } from '../utils/api';
import { headers } from '../styles/index';

const UF = [
  'AC', 'AL', 'AM', 'AP',
  'BA', 'CE', 'DF', 'ES',
  'GO', 'MA', 'MG', 'MS',
  'MT', 'PA', 'PB', 'PE',
  'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC',
  'SE', 'SP', 'TO',
];

class AddressModal extends Component {
  constructor(props) {
    super(props);
    const cep = `${(props.address.cep || '')}`;
    const number = `${(props.address.number || '')}`;
    this.state = {
      ...props.address,
      cep,
      number,
    };
  }

  normalizeNumber(value) {
    return value.replace(/[^0-9-]/g, '');
  }

  onChangeName = (value) => {
    const name = value && value.toUpperCase();
    this.setState({ name });
  }

  onChangeCep = (number) => {
    const cep = this.normalizeNumber(number);
    this.setState({ cep });
  }

  onChangeUf = (uf) => {
    this.setState({ uf });
  }

  onChangeCity = (city) => {
    this.setState({ city });
  }

  onChangeNeighborhood = (neighborhood) => {
    this.setState({ neighborhood });
  }

  onChangeStreet = (street) => {
    this.setState({ street });
  }

  onChangeNumber = (value) => {
    const number = this.normalizeNumber(value);
    this.setState({ number });
  }

  onChangeComplement = (complement) => {
    this.setState({ complement });
  }

  onBlurCep = () => {
    const { cep } = this.state;
    UserService.getCep(cep).then((data) => {
      const address = {
        uf: data.uf,
        city: data.localidade,
        neighborhood: data.bairro,
        street: data.logradouro,
      };
      this.setState({ ...address });
    }).catch(() => ApiUtils.error(`Não foi possível encontrar o CEP ${cep}`));
  }

  onSubmit() {
    const translate = {
      name: 'Apelido',
      cep: 'CEP',
      uf: 'UF',
      city: 'Cidade',
      neighborhood: 'Bairro',
      street: 'Rua',
      number: 'Número',
      complement: 'Complemento',
    };
    let error = false;
    Object.keys(this.state).forEach((k) => {
      if (!this.state[k]) {
        ApiUtils.error(`Você precisa inserir um/a ${translate[k]} para o endereço.`);
        error = true;
      }
    });
    if (!(this.state.cep.length === 8)) {
      ApiUtils.error('CEP inválido');
      error = true;
    }
    error = !!this.props.addresses
      .find(a => a.id !== this.state.id && a.name.trim() === this.state.name.trim());
    if (error) {
      ApiUtils.error('Já existe um endereço com esse nome.');
    }

    if (!error) {
      const isUpdate = this.props.addresses
        .find(a => a.id === this.state.id || a.name.trim() === this.state.name.trim());
      const action = isUpdate
        ? this.props.userActions.updateAddress
        : this.props.userActions.addAddress;
      action(this.state);
      ApiUtils.success('Endereço adicionado.');
      this.props.navActions.back();
    }
  }

  render() {
    const {
      id = 0, name = '',
      cep, uf, city,
      neighborhood, street,
      number, complement,
    } = this.state;
    const ufList = UF.map(u => <Picker.Item key={`${u}`} label={`${u}`} value={`${u}`} />);
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <IconButton
          onPress={this.props.navActions.back}
          iconName={'arrow-left'}
          style={headers.backButton}
          iconStyle={headers.backButtonIcon}
        />
      <Content>
      <ScrollView style={{ flex: 1, marginTop: 20 }}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', fontSize: 30 }}>Endereço</Text>
        </View>
        <View style={{ flex: 4 }}>
          <Form style={{ marginBottom: 20 }}>
            <Item inlineLabel>
              <Label>Apelido:</Label>
              <Input
                onChangeText={this.onChangeName}
                value={name}
              />
            </Item>
            <Item inlineLabel>
              <Label>CEP:</Label>
              <Input
                keyboardType={'numeric'}
                onChangeText={this.onChangeCep}
                onBlur={this.onBlurCep}
                value={`${(cep || '')}`}
              />
            </Item>
            <Item inlineLabel>
              <Label>UF:</Label>
              <Picker
                mode="dropdown"
                iosIcon={<Icon name="arrow-down" />}
                placeholder="Selecione seu estado"
                placeholderStyle={{ color: '#bfc6ea' }}
                placeholderIconColor="#007aff"
                selectedValue={uf}
                onValueChange={this.onChangeUf}
              >
                { ufList }
              </Picker>
              </Item>
              <Item inlineLabel>
                <Label>Cidade:</Label>
                <Input
                  onChangeText={this.onChangeCity}
                  value={city}
                />
              </Item>
              <Item inlineLabel>
                <Label>Bairro:</Label>
                <Input
                  onChangeText={this.onChangeNeighborhood}
                  value={neighborhood}
                />
              </Item>
              <Item inlineLabel>
                <Label>Rua:</Label>
                <Input
                  onChangeText={this.onChangeStreet}
                  value={street}
                />
              </Item>
              <Item inlineLabel>
                <Label>Número:</Label>
                <Input
                  onChangeText={this.onChangeNumber}
                  value={`${(number || '')}`}
                />
              </Item>
              <Item inlineLabel>
                <Label>Complemento:</Label>
                <Input
                  onChangeText={this.onChangeComplement}
                  value={complement}
                />
              </Item>
            </Form>
          </View>
      </ScrollView>
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <Button
          style={{ marginLeft: 5, marginRight: 5 }}
          onPress={
            () => this.onSubmit({
              id,
              name,
            })
          }
          block
          dark
        >
          <Text>{ id ? 'Voltar' : 'Adicionar'}</Text>
        </Button>
      </View>
      </Content>
      </View>
    );
  }
}

AddressModal.propTypes = {
  address: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    cep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    uf: PropTypes.string,
    city: PropTypes.string,
    neighborhood: PropTypes.string,
    street: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    complement: PropTypes.string,
    pending: PropTypes.bool,
  }),
  addresses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    cep: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    uf: PropTypes.string,
    city: PropTypes.string,
    neighborhood: PropTypes.string,
    street: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    complement: PropTypes.string,
    pending: PropTypes.bool,
  })),
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }),
  userActions: PropTypes.shape({
    addAddress: PropTypes.func.isRequired,
    updateAddress: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps(state) {
  return {
    addresses: state.login.user.address,
    address: state.temporary.address,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    userActions: bindActionCreators(UserActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddressModal);
