import React, { Component } from 'react';
import { StyleSheet, Animated, View, FlatList, TouchableOpacity } from 'react-native';
import { Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import * as Actions from '../actions/myStores';
import { stores } from '../styles';

const styles = StyleSheet.create(stores);

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
        <FastImage
          style={imageStyle}
          source={{ uri: item.logo }}
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  }

  handleRefresh() {
    this.props.storesActions.list(this.props.jwt);
  }

  render() {
    return (
      <View style={{flex: 1}}>
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
