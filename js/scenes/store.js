import React, { Component } from 'react';
import { StyleSheet, Animated, FlatList, TouchableOpacity, View, Text } from 'react-native';
import { Container, Header, Body, Left, Right, Tabs, Tab, Title, Icon, Spinner, ScrollableTab } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import * as Actions from '../actions/store';
import * as NavActions from '../actions/navigation';
import * as ProductsActions from '../actions/products';
import { store } from '../styles';
import IconButton from '../components/iconButton';

const styles = StyleSheet.create(store);

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
    const list = this.filterProductsAvailable(nextProps.store.list);
    this.setState({
      ...nextProps.store,
      jwt: nextProps.jwt,
      list,
    });
  }

  filterProductsAvailable(products = []) {
    return products.filter((product) => {
      const isProductAvailable = this.filterQuantityAvailable(product.sizes).length > 0;
      return isProductAvailable;
    });
  }

  filterQuantityAvailable(sizes) {
    return sizes.filter(size => size.quantity > 0);
  }

  pressItem(item) {
    this.props.productsActions.showProduct(item);
  }

  renderItem({ item, index }) {
    const image = item.images[0];
    const uri = (image && image.url) || 'https://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder.png';
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
        <FastImage
          style={imageStyle}
          source={{ uri }}
          resizeMode={'contain'}
        />
        <Text style={{ textAlign: 'center' }}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { list = [] } = this.state;
    const groupedProducts = _.groupBy(
      list,
      product => product.name.split(' ')[0],
    );
    return (
      <Container>
        <Header hasTabs>
          <Left>
            <IconButton
              iconName="arrow-left"
              iconStyle={{ fontSize: 24 }}
              style={{ padding: 10 }}
              onPress={() => this.props.navActions.back()}
            />
          </Left>
          <Body>
            <Title style={{ color: 'black' }}>{this.state.name}</Title>
          </Body>
          <Right>
            <IconButton
              iconName="shopping-cart"
              iconStyle={{ fontSize: 24 }}
              style={{ padding: 10 }}
              onPress={() => this.props.navActions.bag()}
            />
          </Right>
        </Header>
        <View style={{ flex: 1 }} >
        <Tabs tabBarBackgroundColor={'white'} renderTabBar={() => <ScrollableTab />}>
            { list.length > 0 ? Object.entries(groupedProducts).map(([key, value]) => (
              <Tab key={`store-tab-${key}`} heading={key}>
                { this.state.loadingRequest
                  ? <Spinner />
                  : <FlatList
                    key={`store-product-${key}`}
                    ref={(ref) => { this.listRef = ref; }}
                    numColumns={2}
                    horizontal={false}
                    data={value}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                  />
                }
              </Tab>
              ))
              : <Tab key={'store-tab-nenhum'} heading={'Nenhum Produto'}>
                <Text>Esta loja não possui produtos</Text>
              </Tab>
            }
          </Tabs>
        </View>
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
