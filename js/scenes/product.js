import React, { Component } from 'react';
import {
  StyleSheet, ScrollView, View,
  Dimensions, Text, Platform, StatusBar,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Icon } from 'native-base';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import { Lightbox } from '@shoutem/ui';
import FastImage from 'react-native-fast-image';
import IconButton from '../components/iconButton';
import Size from '../components/size';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/stores';
import * as BagActions from '../actions/bag';
import * as style from '../styles/index';
import { ApiUtils } from '../utils/api';

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
  footer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  currency: {
    flex: 1,
    justifyContent: 'center',
  },
  currencyText: {
    flex: 1,
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    padding: 11,
  },
  footerButtonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: 'black',
  },
  footerButton: {
    flex: 1,
    alignSelf: 'center',
  },
  buyButton: {
    color: 'white',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 15,
    zIndex: 2,
    backgroundColor: 'white',
    opacity: 0.5,
    borderRadius: 5,
    padding: 10,
  },
  backButtonIcon: {
    color: '#000',
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  description: {
    flex: 2,
    padding: 10,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  info: {
    flex: 1,
    fontSize: 16,
  },
  sizesContainer: {
    flex: 1,
    flexDirection: 'column',
    marginTop: 10,
    paddingLeft: 10,
    backgroundColor: 'transparent',
    borderColor: '#ddd',
    borderBottomWidth: 1,
  },
  sizes: {
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    backgroundColor: 'transparent',
  },
  size: {
    padding: 10,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 100,
    backgroundColor: 'white',
  },
});

class LoadStore extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      store: null,
      loading: false,
    };
    this.openStore = this.openStore.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true });
    ApiUtils.request(`stores/${this.props.id}`, this.props.jwt)
      .then(({ data }) => {
        this.setState({ loading: false, store: data });
      }).catch((error) => {
        ApiUtils.error(error);
      });
  }

  openStore() {
    this.props.onPress(this.state.store);
  }

  render() {
    const { loading, store } = this.state;
    if (!loading && store) {
      return (
        <IconButton
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            padding: 5,
            borderRadius: 100,
            alignSelf: 'center',
            opacity: 0.5,
            backgroundColor: 'black',
          }}
          onPress={this.openStore}
          iconName={'eye'}
          iconStyle={{
            color: 'white',
            fontSize: 24,
          }}
        />
      );
    }
    return null;
  }
}

LoadStore.propTypes = {
  id: PropTypes.number.isRequired,
  jwt: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.product,
      selectedSize: this.filterAvailable(props.product.sizes)[0],
      isLoading: false,
    };
    this.onPressSize = this.onPressSize.bind(this);
  }

  filterAvailable(sizes) {
    return sizes.filter(size => size.quantity > 0);
  }

  componentWillMount() {
    if (isIOS) StatusBar.setHidden(true, 'fade');
  }

  componentWillUnmount() {
    if (isIOS) StatusBar.setHidden(false, 'fade');
  }

  addProduct(jwt, sizeId) {
    const productData = {
      item_cart: {
        quantity: 1,
        status: 0, // Define o produto como aguardando confirmação do lojista
        size_id: sizeId,
      },
    };
    this.setState({ isLoading: true });
    this.props.bagActions.addProductToBag(jwt, productData)
      .then(() => {
        this.setState({ isLoading: false });
        this.props.navActions.bag();
      }).catch(() => this.setState({ isLoading: false }));
  }

  onPressSize(size) {
    this.setState({ selectedSize: size });
  }

  render() {
    const { images } = this.state;
    console.log('Images: ', images);
    const sizes = this.filterAvailable(this.state.sizes);
    return (
      <View style={{ flex: 1 }}>
        <IconButton
          iconName={'arrow-left'}
          style={styles.backButton}
          onPress={this.props.navActions.back}
          iconStyle={styles.backButtonIcon}
        />
        <ScrollView style={styles.container}>
          <Carousel
            style={styles.carrousel}
            pageStyle={styles.slide}
            autoplay={false}
            pageInfo
          >
            { images.length > 0 ? images.map(image => (
              <View key={`product_${image.id}`} style={styles.slide}>
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
              <View>
                <Text style={styles.currencyText}>R${this.state.selectedSize.price}</Text>
              </View>
            </View>
            <View style={styles.footerButtonContainer}>
              { this.state.isLoading
                ? <View style={styles.footerButton}>
                    <ActivityIndicator
                      style={styles.footerButton}
                      size={'small'}
                      color={'white'}
                    />
                  </View>
                : (
                  <Button
                    style={styles.footerButton}
                    transparent
                    onPress={() => this.addProduct(this.props.jwt, this.state.selectedSize.id)}
                  >
                    <Icon
                      style={styles.buyButton}
                      name="shopping-cart"
                    />
                  </Button>
                )
              }
            </View>
          </View>
          <View style={styles.details}>
            <View style={styles.sizesContainer}>
              <Text style={styles.info}>
                Tamanhos:
              </Text>
              <View style={styles.sizes}>
                { sizes.map(size => (
                  <Size
                    key={`size-${size.name}`}
                    style={styles.size}
                    size={size}
                    selected={this.state.selectedSize.name === size.name}
                    onPress={this.onPressSize}
                  />
                ))}
              </View>
            </View>
            <View style={styles.description}>
              <Text style={styles.info}>
                {this.state.description}
              </Text>
            </View>
          </View>
        </ScrollView>
        <LoadStore
            jwt={this.props.jwt}
            id={this.props.product.store_id}
            onPress={this.props.storesActions.openStore}
          />
      </View>
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
    storesActions: bindActionCreators(StoresActions, dispatch),
    bagActions: bindActionCreators(BagActions, dispatch),
  };
}

Product.propTypes = {
  jwt: PropTypes.string.isRequired,
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.object).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.object).isRequired,
    store_id: PropTypes.number.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
  bagActions: PropTypes.shape({
    addProductToBag: PropTypes.func.isRequired,
  }).isRequired,
  storesActions: PropTypes.shape({
    openStore: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Product);
