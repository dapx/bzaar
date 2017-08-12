import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Left, Button, Icon, Title, Content, Body, Footer } from 'native-base';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import * as NavActions from '../actions/navigation';
import * as style from '../styles/index';

const imageWidth = style.getDeviceWidth(100);
const imageHeight = style.getDeviceHeight(50);
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

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: '',
      price: 0,
      image: '',
      images: [
      ],
      quantity: 0,
      size: '',
    };
  }

  componentWillMount() {
    this.setState({
      jwt: this.props.jwt,
      ...this.props.product,
      images: [ this.props.product.image ],
    });
  }

  componentWillReceiveProps(nextProps) {
  }

  componentReceivedProps() {
    console.warn("componentReceivedProps");
  }

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="black">
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </Button>
            <Title style={{ color: 'black', alignSelf: 'center' }}>Produto</Title>
          </Left>
        </Header>
        <Content>
          <Body>
            <Title style={styles.title}>
              {this.state.name}
            </Title>
            <Carousel
              style={styles.carrousel}
              pageStyle={styles.slide}
              autoplay={false}
              pageInfo
            >
              { this.state.images.map((image, i) => (
                <View key={'product_' + i} style={styles.slide}>
                  <Image
                    style={styles.images}
                    source={{ url: image }}
                  />
                </View>
                ))
              }
            </Carousel>
            <View style={styles.description}>
              <Text style={styles.info}>
                {this.state.description}
              </Text>
              <Text style={styles.info}>
                Tamanho: {this.state.size}
              </Text>
              <Text style={styles.info}>
                Unidades: {this.state.quantity}
              </Text>
            </View>
          </Body>
        </Content>
        <Footer style={styles.footer}>
          <View style={styles.currency}>
            <Text style={styles.currencyText}>R${this.state.price}</Text>
          </View>
          <Button
            style={styles.footerButton}
            transparent
            onPress={this.props.navActions.bag}
          >
            <Icon
              style={styles.buyButton}
              name="cart-plus"
            />
          </Button>
        </Footer>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    product: state.products.product,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

Product.propTypes = {
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
