import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Left, Button, Icon, Title, Content, Body } from 'native-base';
import Carousel from 'react-native-looped-carousel';
import * as Actions from '../actions/store';
import * as NavActions from '../actions/navigation';
import * as style from '../styles/index';

const imageWidth = style.getDeviceWidth(100);
const imageHeight = style.getDeviceHeight(60);
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    margin: 10,
    color: 'black',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  slide: {
    width,
    height,
  },
  carrousel: {
    width,
    height: imageHeight,
  },
  images: {
    width: imageWidth,
    height: imageHeight,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  footerButton: {
    flex: 2,
    justifyContent: 'center',
  },
});

class Product extends Component {

  render() {
    return (
      <Container style={styles.container}>
        <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="black">
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </Button>
            <Title style={{ color: 'black', alignSelf: 'center' }}>Produto</Title>
          </Left>
        </Header>
        <Content>
          <Body>
            <Title style={styles.title}>
              Camisa Modelo XY
            </Title>
            <Carousel
              style={styles.carrousel}
              pageStyle={styles.slide}
              autoplay={false}
              pageInfo
            >
              <View style={styles.slide}>
                <Image
                  style={styles.images}
                  source={{ url: 'https://www.tuberia.com.br/media/catalog/product/cache/1/image/800x/9df78eab33525d08d6e5fb8d27136e95/t/r/tri_ngulos_manga_preta-min.png' }}
                />
              </View>
              <View style={styles.slide}>
                <Image
                  style={styles.images}
                  source={{ url: 'https://cdn.shopify.com/s/files/1/2010/5247/products/IMG_4090_7d5ce64d-1098-4920-9845-bc5e3ffc61c2.jpg' }}
                />
              </View>
            </Carousel>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            >
              <View style={{ flex: 2, alignItems: 'center' }}>
                <Text style={{ fontSize: 20 }}>R$190</Text>
              </View>
              <Button
                style={styles.footerButton}
                transparent
                onPress={() => console.log('TESTE')}
              >
                <Icon
                  style={{ color: 'black' }}
                  name="heart"
                />
              </Button>
            </View>
          </Body>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
