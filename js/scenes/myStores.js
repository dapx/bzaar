import React, { Component } from 'react';
import { StyleSheet, Animated, View, Image, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Spinner, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as Actions from '../actions/myStores';
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

class MyStores extends Component {

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
    this.props.storesActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loadingRequest: nextProps.loadingRequest,
      list: nextProps.list,
      jwt: nextProps.jwt,
    });
  }

  pressItem(item) {
    this.props.storesActions.openStore(item);
  }

  openNew() {
    this.props.storesActions.openNewStore();
  }

  renderItem({ item, index }) {
    const size = this.state.list.length - 1;
    const imageStyle = (size === index && this.state.list.length % 2 > 0)
      ? styles.storeUniqueImage
      : styles.storeImage;
    return (
      <TouchableOpacity key={`stores_${index}`} style={styles.imageContainer} onPress={() => this.pressItem(item)}>
        <Image style={imageStyle} source={{ uri: item.logo }} />
      </TouchableOpacity>
    );
  }

  handleRefresh() {
    this.props.storesActions.list(this.props.jwt);
  }

  render() {
    return (
      <View>
        <Button full
          style={{backgroundColor: '#bcb3c5', opacity: 0.8}}
          onPress={() => this.openNew()}
        >
          <Text>Criar nova loja</Text>
        </Button>
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
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    list: state.myStores.list,
    loadingRequest: state.myStores.loadingRequest,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storesActions: bindActionCreators(Actions, dispatch),
  };
}

MyStores.defaultProps = {
  list: [],
  loadingRequest: false,
};

MyStores.propTypes = {
  jwt: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.object),
  loadingRequest: PropTypes.bool,
  storesActions: PropTypes.shape({
    list: PropTypes.func.isRequired,
    openStore: PropTypes.func.isRequired,
    openNewStore: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyStores);
