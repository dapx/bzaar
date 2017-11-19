import React, { Component } from 'react';
import { StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { Container, Header, Left, Body, Right, Tabs, Tab, Icon, Text, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Products from './products';
import MyStores from './myStores';
import * as Actions from '../actions/stores';
import * as NavActions from '../actions/navigation';
import { stores } from '../styles';

const styles = StyleSheet.create(stores);

class Stores extends Component {

  constructor(props) {
    super(props);
    this.state = {
      jwt: this.props.jwt,
      list: this.props.stores.list || [],
      loadingRequest: !!this.props.stores.loadingRequest,
    };
    this.renderItem = this.renderItem.bind(this);
  }

  componentDidMount() {
    this.props.storeActions.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      loadingRequest: nextProps.stores.loadingRequest,
      list: nextProps.stores.list,
    });
  }

  pressItem(item) {
    this.props.storeActions.openStore(item);
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
        <Image source={{ uri: item.logo }} style={imageStyle} />
      </TouchableOpacity>
    );
  }

  handleRefresh() {
    this.props.storeActions.list(this.props.jwt);
  }

  render() {
    return (
      <FlatList
        numColumns={2}
        horizontal={false}
        data={this.state.list}
        renderItem={this.renderItem}
        keyExtractor={item => item.id}
        refreshing={this.state.loadingRequest}
        onRefresh={() => this.handleRefresh()}
        ListEmptyComponent={<Text>Não foi possivel encontrar lojas.</Text>}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    stores: state.stores,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
  };
}

Stores.propTypes = {
  jwt: PropTypes.string.isRequired,
  stores: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.object),
    loadingRequest: PropTypes.bool,
  }).isRequired,
  storeActions: PropTypes.shape({
    list: PropTypes.func.isRequired,
    openStore: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Stores);