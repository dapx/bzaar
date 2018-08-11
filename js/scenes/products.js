import React, { Component } from 'react';
import { Platform, KeyboardAvoidingView, View, Text, Animated } from 'react-native';
import { Input } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import List from '../components/list';
import ListItem from '../components/productItem';
import * as Actions from '../actions/products';

class SearchInput extends React.PureComponent {
  render() {
    return (
      <Animated.View {...this.props}>
        <Input
          style={{ color: 'white', fontSize: 15, minWidth: 100 }}
          placeholder={'Pesquisar'}
          onChangeText={this.props.onSearch}
        />
      </Animated.View>
    );
  }
}

SearchInput.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  onSearch: PropTypes.func.isRequired,
};

const keyboardBehavior = Platform.OS === 'ios' ? {
  behavior: 'padding',
  keyboardVerticalOffset: 100,
} : {};

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animatedY: new Animated.Value(10),
    };
    this.onPress = this.onPress.bind(this);
  }

  componentDidMount() {
    this.props.productsActions.list(this.props.jwt);
  }

  onPress(item) {
    this.props.productsActions.showProduct(item);
  }

  handleSearch = _.debounce(
    (text) => {
      const { jwt } = this.props;
      this.props.productsActions.search(jwt, text);
    },
    500,
  )

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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        { ...keyboardBehavior }
      >
      <View style={{ flex: 1 }}>
        <List
          ref={(ref) => { this.listRef = ref; }}
          data={this.props.list}
          refreshing={this.props.loadingRequest}
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
          onSearch={this.handleSearch}
        />
      </View>
      </KeyboardAvoidingView>
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
    search: PropTypes.func.isRequired,
    showProduct: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
