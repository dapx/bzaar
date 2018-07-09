import React, { Component } from 'react';
import { View, Text, Animated } from 'react-native';
import { Input } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import List from '../components/list';
import ListItem from '../components/productItem';
import * as Actions from '../actions/products';
import { ApiUtils } from '../utils/api';

class SearchInput extends React.PureComponent {
  doSearch = _.debounce(
    (text) => {
      const { jwt, setLoading, getResult } = this.props;
      setLoading(true);
      return ApiUtils.request('products', jwt, text)
        .then(({ data }) => {
          setLoading(false);
          return getResult(data);
        });
    },
    500,
  )

  render() {
    return (
      <Animated.View {...this.props}>
        <Input
          style={{ color: 'white', fontSize: 15 }}
          placeholder={'Pesquisar'}
          onChangeText={this.doSearch}
        />
      </Animated.View>
    );
  }
}

SearchInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  jwt: PropTypes.string.isRequired,
  getResult: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      jwt: '',
      loadingRequest: false,
      animatedY: new Animated.Value(10),
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.productsActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    // TODO - MIGRAR FILTRO PARA O SERVER
    const list = this.filterProductsAvailable(nextProps.list);
    this.setState({
      loadingRequest: nextProps.loadingRequest,
      jwt: nextProps.jwt,
      list,
    });
  }

  onPress(item) {
    this.props.productsActions.showProduct(item);
  }

  filterProductsAvailable(products) {
    return products.filter((product) => {
      const isProductAvailable = this.filterQuantityAvailable(product.sizes).length > 0;
      return isProductAvailable;
    });
  }

  filterQuantityAvailable(sizes) {
    return sizes.filter(size => size.quantity > 0);
  }

  getResult = list => this.setState({ list })
  setLoading = loadingRequest => this.setState({ loadingRequest })

  getSearchYPosition = () => {
    const { animatedY } = this.state;
    const interpolation = Animated.diffClamp(animatedY, 0, 20).interpolate({
      inputRange: [0, 20],
      outputRange: [-10, 60],
    });
    return {
      transform: [{
        translateY: interpolation,
      }],
    };
  }

  handleRefresh() {
    this.props.productsActions.list(this.props.jwt);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <List
          ref={(ref) => { this.listRef = ref; }}
          data={this.state.list}
          refreshing={this.state.loadingRequest}
          onRefresh={() => this.handleRefresh()}
          ListEmptyComponent={<Text>Não foi possivel encontrar produtos.</Text>}
          ListItem={ListItem}
          onPressItem={this.onPress}
          scrollY={this.state.animatedY}
          scrollEventThrottle={8}
        />
        <SearchInput
          style={[{
              flex: 1,
              left: 'auto',
              top: 'auto',
              alignSelf: 'center',
              bottom: 10,
              backgroundColor: 'black',
              position: 'absolute',
              opacity: 0.8,
              borderRadius: 50,
              paddingLeft: 10,
              paddingRight: 10,
            },
            this.getSearchYPosition(),
          ]}
          jwt={this.props.jwt}
          getResult={this.getResult}
          setLoading={this.setLoading}
        />
      </View>
    );
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
