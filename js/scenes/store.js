import React, { Component } from 'react';
import { StyleSheet, Animated, View, ScrollView, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Container, Header, Left, Body, Right, Content, Thumbnail, Title, Tabs, Tab, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/store';
import * as NavActions from '../actions/navigation';
import { getDeviceWidth } from '../styles';

const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = 200; //HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  bar: {
    marginTop: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 18,
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
});

class Store extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: this.props.store.id,
      name: this.props.store.name,
      logo: this.props.store.logo,
      email: this.props.store.email,
      description: this.props.store.description,
      list: this.props.store.list || [],
      jwt: this.props.jwt,
      loadingRequest: !!this.props.store.loadingRequest,
      scrollY: new Animated.Value(0),
    }
  }

  componentWillMount(){
    this.props.storeActions.listProductsByStore(this.props.jwt, this.props.store.id);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({name: nextProps.store.name, id: nextProps.store.id, email: nextProps.store.email, loadingRequest: nextProps.store.loadingRequest, list: nextProps.store.list, jwt: nextProps.jwt});
  }

  pressItem() {
    this.props.navActions.creditCard();
  }

  renderItem({item, index}) {
    let size = this.state.list.length-1;
    let imageStyle = ((size) == index && this.state.list.length % 2 > 0)
      ? styles.storeUniqueImage
      : styles.storeImage;
    return (
      <TouchableOpacity key={index} style={styles.imageContainer} onPress={() => this.pressItem()}>
        <Image style={imageStyle} source={{uri: item.image}} />
      </TouchableOpacity>
    );
  }

  render() {
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });
    const imageOpacityInverse = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp',
    });
    const imageSize = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [130, 50],
      extrapolate: 'clamp',
    });
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    const fontSize = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [18, 0, 0],
      extrapolate: 'clamp',
    });
    return (
      <Container>
          <Animated.View style={[styles.header, {height: headerHeight}]}>
          <Animated.View style={{marginLeft: 10}}>
          <TouchableOpacity onPress={() => this.props.navActions.back()}>
            <Icon style={{color: 'black'}} name='arrow-left' />
          </TouchableOpacity>
          </Animated.View>
          <View>
            <Animated.Image style={{alignSelf: 'center', width: imageSize, height: imageSize, resizeMode: 'contain'}} source={{uri: this.state.logo}} />
            <Animated.Text style={{opacity: imageOpacity, alignSelf: 'center', fontSize: fontSize}}>{this.state.description}</Animated.Text>
          </View>
          <Animated.View style={{marginRight: 10, opacity: imageOpacityInverse}}>
            <TouchableOpacity onPress={() => this.props.navActions.bag()}>
              <Icon style={{color: 'black'}} name='shopping-bag' />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
        <Animated.View style={{flex: 1, marginTop: headerHeight}}>
        <Tabs>
          <Tab heading="Todos">
            { !!this.state.loadingRequest
              ? <Spinner />
              : <FlatList
                  numColumns={2}
                  horizontal={false}
                  getItemLayout={(data, index) => (
                    {width: styles.storeImage.width, height: styles.storeImage.height, offset: styles.storeImage.height * index, index}
                  )}
                  data={this.state.list}
                  renderItem={this.renderItem.bind(this)}
                  keyExtractor={item => item.id}
                  scrollEventThrottle={16}
                  onScroll={Animated.event(
                    [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                  )} />
            }
            </Tab>
          </Tabs>
          </Animated.View>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    store: state.store,
    jwt: state.login.jwt
   };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Store);
