import React, { Component } from 'react';
import { StyleSheet, Animated, Image, FlatList, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import { Container, Header, Body, Left, Right, Tabs, Tab, Icon, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/store';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import { getDeviceWidth, getDeviceHeight } from '../styles';

const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 60 : 73;
const HEADER_MAX_HEIGHT = getDeviceHeight(100);

const AnimatedHeader = Animated.createAnimatedComponent(Header);

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  storeImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    resizeMode: 'contain',
  },
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
});

class Store extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.store,
      jwt: this.props.jwt,
      scrollY: new Animated.Value(0),
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.storeActions.listProductsByStore(this.props.jwt, this.props.store.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...nextProps.store,
      jwt: nextProps.jwt,
    });
  }

  pressItem(item) {
    this.props.productsActions.showProduct(item);
  }

  renderItem({ item, index }) {
    const size = this.state.list.length - 1;
    const imageStyle = (size === index && this.state.list.length % 2 > 0)
      ? styles.storeUniqueImage
      : styles.storeImage;
    return (
      <TouchableOpacity
        key={index}
        style={styles.imageContainer}
        onPress={() => this.pressItem(item)}
      >
        <Image style={imageStyle} source={{ uri: item.image }} />
      </TouchableOpacity>
    );
  }

  render() {
    const imageSize = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [1, 0.2],
      extrapolate: 'clamp',
    });
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    const tabMargin = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    return (
      <Container>
        <AnimatedHeader hasTabs style={[styles.header, { height: headerHeight }]}>
          <Left>
            <TouchableOpacity style={{ padding: 5 }} onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </TouchableOpacity>
          </Left>
          <Body>
            <TouchableWithoutFeedback
              onPress={() => Animated.timing(this.state.scrollY, {
                toValue: HEADER_MIN_HEIGHT,
                duration: 500,
              }).start()}
            >
              <Animated.Image
                style={{
                  alignSelf: 'center',
                  width: 200,
                  height: 200,
                  transform: [
                    { scaleY: imageSize },
                    { scaleX: imageSize },
                  ],
                  resizeMode: 'contain',
                }}
                source={{ uri: this.state.logo }}
              />
            </TouchableWithoutFeedback>
          </Body>
          <Right>
            <TouchableOpacity style={{ padding: 5 }} onPress={() => this.props.navActions.bag()}>
              <Icon style={{ color: 'black' }} name="shopping-bag" />
            </TouchableOpacity>
          </Right>
        </AnimatedHeader>
        <Animated.View style={{ flex: 1, marginTop: tabMargin }}>
          <Tabs>
            <Tab heading="Todos">
              { this.state.loadingRequest
                ? <Spinner />
                : <FlatList
                  ref={(ref) => { this.listRef = ref; }}
                  numColumns={2}
                  horizontal={false}
                  data={this.state.list}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.id}
                />
              }
            </Tab>
          </Tabs>
        </Animated.View>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: state.store,
    jwt: state.login.jwt,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
    productsActions: bindActionCreators(ProductsActions, dispatch),
  };
}

Store.propTypes = {
  jwt: PropTypes.string.isRequired,
  store: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.object),
    loadingRequest: PropTypes.bool,
  }).isRequired,
  storeActions: PropTypes.shape({
    listProductsByStore: PropTypes.func.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    bag: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired,
    product: PropTypes.func.isRequired,
  }).isRequired,
  productsActions: PropTypes.shape({
    showProduct: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Store);
