import React, { Component } from 'react';
import { StyleSheet, Animated, FlatList, TouchableOpacity, Platform, Text } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import * as Actions from '../actions/products';
import { getDeviceWidth } from '../styles';

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
  },
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 20 : 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  bar: {
    marginTop: Platform.OS === 'ios' ? 28 : 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    resizeMode: 'cover',
  },
});

class Products extends Component {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      jwt: '',
      loadingRequest: false,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.productsActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loadingRequest: nextProps.loadingRequest,
      list: nextProps.list,
      jwt: nextProps.jwt,
    });
  }

  pressItem(item) {
    this.props.productsActions.showProduct(item);
  }

  handleRefresh() {
    this.props.productsActions.list(this.props.jwt);
  }

  renderItem({ item, index }) {
    const size = this.state.list.length - 1;
    const imageStyle = (size === index && this.state.list.length % 2 > 0)
      ? styles.storeUniqueImage
      : styles.storeImage;
    return (
      <TouchableOpacity key={`products_${index}`} style={styles.imageContainer} onPress={() => this.pressItem(item)}>
        <FastImage
            style={imageStyle}
            source={{ uri: item.image }}
            resizeMode={'contain'}
        />
        <Text style={{ textAlign: 'center' }}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const render = (
      <FlatList
        ref={(ref) => { this.listRef = ref; }}
        numColumns={2}
        horizontal={false}
        data={this.state.list}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
        )}
        refreshing={this.state.loadingRequest}
        onRefresh={() => this.handleRefresh()}
        ListEmptyComponent={<Text>Não foi possivel encontrar produtos.</Text>}
      />
      );
    return render;
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    list: state.products.list,
    loadingRequest: state.products.loadingRequest,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    productsActions: bindActionCreators(Actions, dispatch),
  };
}

Products.defaultProps = {
  list: [],
  loadingRequest: false,
};

Products.propTypes = {
  jwt: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object),
  loadingRequest: PropTypes.bool,
  productsActions: PropTypes.shape({
    list: PropTypes.func.isRequired,
    showProduct: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
