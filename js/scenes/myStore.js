import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Icon, Content } from 'native-base';
import PropTypes from 'prop-types';
import Button from '../components/debounceNativeBaseButton';
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

class MyStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: props.store,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      store: nextProps.store,
    });
  }

  render() {
    return (
      <Container style={styles.container}>
        <HeaderBack title={this.state.store.name} back={() => this.props.navActions.back()} />
        <Content style={{ flex: 1 }}>
          <View>
            <Button
              full
              style={{ backgroundColor: '#B22222', flex: 1, margin: 1 }}
              onPress={() => this.props.storesActions.editStore(this.state.store)}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ color: 'black' }} name="home" />
                <Text style={{ alignSelf: 'center' }}>Editar</Text>
              </View>
            </Button>
          </View>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <Button
                large
                style={{ backgroundColor: '#7CFC00', flex: 1, margin: 1 }}
                onPress={() => this.props.storesActions.openProducts(this.state.store.id)}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ color: 'black' }} name="octagon" />
                <Text style={{ alignSelf: 'center' }}>Produtos</Text>
              </View>
            </Button>
            <Button
              large
              style={{ backgroundColor: '#00BFFF', flex: 1, margin: 1 }}
              onPress={() => this.props.navActions.back()}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ color: 'black'  }} name="octagon" />
                <Text style={{ alignSelf: 'center' }}>Entregadores</Text>
              </View>
            </Button>
          </View>
          <View style={{ flex: 2, flexDirection: 'row' }}>
            <Button
              large
              style={{ backgroundColor: '#7B68EE', flex: 1, margin: 1 }}
              onPress={() => this.props.navActions.back()}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ color: 'black' }} name="octagon" />
                <Text style={{ alignSelf: 'center' }}>Dashboard</Text>
              </View>
            </Button>
            <Button
              large
              style={{ backgroundColor: '#FFD700', flex: 1, margin: 1 }}
              onPress={() => this.props.navActions.back()}
            >
              <View style={{ flexDirection: 'row' }}>
                <Icon style={{ color: 'black' }} name="octagon" />
                <Text style={{ alignSelf: 'center', textAlign: 'right' }}>Promoções</Text>
              </View>
            </Button>
          </View>
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
    storesActions: bindActionCreators(StoresActions, dispatch),
  };
}

MyStore.propTypes = {
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
  storesActions: PropTypes.shape({
    editStore: PropTypes.func.isRequired,
    openProducts: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyStore);
