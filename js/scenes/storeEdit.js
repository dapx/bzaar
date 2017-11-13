import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Left, Button, Icon, Title, Content, Body, Footer, Form, Input, Item, Label, Text } from 'native-base';
import { Text as TextBase } from 'native-base';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import HeaderBack from '../components/headerBack';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import * as style from '../styles/index';

const imageWidth = style.getDeviceWidth(100);
const imageHeight = style.getDeviceHeight(30);
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    margin: 10,
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    height,
  },
  carrousel: {
    width,
    height: imageHeight,
  },
  images: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  description: {
    flex: 2,
    flexDirection: 'column',
  },
  info: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  currency: {
    flex: 2,
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 20,
    color: 'white',
  },
  buyButton: {
    color: 'white',
  },
  footerButton: {
    flex: 2,
    justifyContent: 'center',
  },
});

class StoreEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      description: '',
      logo: '',
    };
  }

  componentDidMount() {
    this.setState({
      jwt: this.props.jwt,
      ...this.props.store,
    });
  }

  isNew() {
    return this.state.id === 0
  }

  onPressButton() {

  }

  render() {
    const buttonText = this.isNew() ? 'Criar' : 'Salvar';
    const resizeMode = this.isNew() ? 'stretch' : 'contain';
    const uri = this.isNew() 
      ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWPbrAYB2nxO2MTkMlVPkWfccHoott1Eu5NaLsdYjOFHpvStMO'
      : this.state.logo;
    return (
      <Container style={styles.container}>
        <HeaderBack title={`Edit ${this.state.name}`} back={() => this.props.navActions.back()} />
        <Content style={{flex: 1}}>
          <Image style={{
              width: imageWidth,
              height: imageHeight,
              resizeMode,
              }}
              source={{ uri }} 
          />
          <Form style={{flex: 2}}>
            <Item stackedLabel>
              <Label>Name</Label>
              <Input value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} />
            </Item>
            <Item stackedLabel last>
              <Label>description</Label>
              <Input value={this.state.description} />
            </Item>
          </Form>
          <Button full
            style={{backgroundColor: 'black'}}
            onPress={this.onPressButton}
          >
            <Text>{buttonText}</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    store: state.myStores.store,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    StoresActions: bindActionCreators(StoresActions, dispatch),
  };
}

StoreEdit.propTypes = {
  jwt: PropTypes.string.isRequired,
  store: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
  StoresActions: PropTypes.shape({
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreEdit);
