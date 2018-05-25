import React, { Component } from 'react';
import { StyleSheet, Animated, View, FlatList } from 'react-native';
import { Card, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import * as Actions from '../actions/myStores';
import { stores } from '../styles';
import NBButton from '../components/debounceNativeBaseButton';
import Button from '../components/button';

const styles = StyleSheet.create(stores);

class MyStores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      jwt: '',
      loadingRequest: true,
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

  onPress(item) {
    this.props.storesActions.openStore(item);
  }

  openNew() {
    this.props.storesActions.openNewStore();
  }

  renderItem({ item, index }) {
    const uri = item.logo || 'https://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder.png';
    const { name } = item;
    return (
      <Button
        key={`product-store-${index}`}
        style={{ flex: 1 }}
        onPress={() => this.onPress(item)}
      >
        <Card>
          <FastImage
            style={styles.storeUniqueImage}
            source={{ uri }}
            resizeMode={'contain'}
          />
          <Text style={{
            backgroundColor: 'gray',
            color: 'white',
            textAlign: 'center',
          }}>{`${name}`}</Text>
        </Card>
      </Button>
    );
  }

  handleRefresh() {
    this.props.storesActions.list(this.props.jwt);
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <NBButton full
          style={{ backgroundColor: '#ddd' }}
          onPress={() => this.openNew()}
        >
          <Text style={{ color: 'gray' }}>Criar nova loja</Text>
        </NBButton>
        <FlatList
          ref={(ref) => { this.listRef = ref; }}
          numColumns={2}
          horizontal={false}
          data={this.state.list}
          renderItem={this.renderItem}
          keyExtractor={item => item.id}
          scrollEventThrottle={1}
          onScroll={
            Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }])
          }
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
