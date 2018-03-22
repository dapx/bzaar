import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Dimensions, Text, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon } from 'native-base';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import { Lightbox } from '@shoutem/ui';
import FastImage from 'react-native-fast-image';
import IconButton from '../components/iconButton';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import * as style from '../styles/index';

const imageWidth = style.getDeviceWidth(100);
const imageHeight = style.getDeviceHeight(50);

const { width, height } = Dimensions.get('window');
const lightboxStyle = { style: { width, height } };
const isIOS = Platform.OS === 'ios';

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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 2,
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 5,
    padding: 5,
  },
  backButtonIcon: {
    color: '#000',
  },
});

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      description: '',
      images: [
      ],
      sizes: [],
    };
  }

  componentWillMount() {
    if (isIOS) StatusBar.setHidden(true, 'fade');
  }

  componentWillUnmount() {
    if (isIOS) StatusBar.setHidden(false, 'fade');
  }


  componentDidMount() {
    this.setState({
      jwt: this.props.jwt,
      ...this.props.product,
    });
  }

  addProduct(jwt, productId) {
    const productData = {
      item_cart: {
        quantity: 1,
        status: 0, // Define o produto como aguardando confirmação do lojista
        product_id: productId,
      },
    };
    this.props.productsActions.addProductToBag(jwt, productData);
  }

  render() {
    const { images } = this.state;
    return (
      <ScrollView style={styles.container}>
        <IconButton
          style={styles.backButton}
          onPress={this.props.navActions.back}
          iconName={'arrow-left'}
          iconStyle={styles.backButtonIcon}
        />
        <Carousel
          style={styles.carrousel}
          pageStyle={styles.slide}
          autoplay={false}
          pageInfo
        >
          { images.length > 0 ? images.map(image => (
            <View key={`product_${image}`} style={styles.slide}>
              <Lightbox
                activeProps={{ ...lightboxStyle }}
                backgroundColor={'#fff'}
                underlayColor={'#fff'}
                onClose={() => StatusBar.setHidden(true, 'fade')}
              >
                <FastImage
                  style={styles.images}
                  source={{ uri: image.url }}
                  resizeMode={'contain'}
                />
              </Lightbox>
            </View>
            ))
            : <FastImage
              style={styles.images}
              source={{ uri: 'https://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder.png' }}
              resizeMode={'contain'}
            />
          }
        </Carousel>
        <View style={styles.footer}>
          <View style={styles.currency}>
            <Text style={styles.currencyText}>R${this.state.price}</Text>
          </View>
          <Button
            style={styles.footerButton}
            transparent
            onPress={() => this.addProduct(this.state.jwt, this.state.id)}
          >
            <Icon
              style={styles.buyButton}
              name="shopping-cart"
            />
          </Button>
        </View>
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
      </ScrollView>
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
    productsActions: bindActionCreators(ProductsActions, dispatch),
  };
}

Product.propTypes = {
  jwt: PropTypes.string.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
  productsActions: PropTypes.shape({
    addProductToBag: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
