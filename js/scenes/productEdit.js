import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Button, Content, Form, Input, Item, Label, Text, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import Carousel from 'react-native-looped-carousel';
import FastImage from 'react-native-fast-image';
import { Lightbox } from '@shoutem/ui';
import _ from 'lodash';
import IconButton from '../components/iconButton';
import SizePicker from '../components/sizePicker';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import { storeEdit, headers } from '../styles/index';
import { ApiUtils } from '../utils/api';

const styles = StyleSheet.create(storeEdit);
const stylesHeader = StyleSheet.create(headers);
const { width, height } = Dimensions.get('window');
const lightboxStyle = { style: { width, height } };
const isIOS = Platform.OS === 'ios';

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: props.product.id,
        name: props.product.name,
        description: props.product.description,
        images: props.product.images || [],
        sizes: props.product.sizes || [],
        store_id: props.storeId,
      },
      presigned_url: '',
      mimetype: '',
      image_path: '',
      loadingRequest: false,
      uploading: false,
      wasChangedImage: false,
    };
    this.onPressButton = this.onPressButton.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.editImages = this.editImages.bind(this);
  }

  componentWillMount() {
    if (isIOS) StatusBar.setHidden(true, 'fade');
  }

  componentWillUnmount() {
    if (isIOS) StatusBar.setHidden(false, 'fade');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      jwt: nextProps.jwt,
      data: nextProps.product,
      presigned_url: nextProps.product.presigned_url,
      uploading: !!nextProps.product.uploading,
      loadingRequest: !!nextProps.product.loadingRequest,
      image_path: nextProps.product.image_path,
      storeId: nextProps.storeId,
    });
  }

  onChange(object) {
    const data = { ...this.state.data, ...object };
    this.setState({ data });
  }

  onChangeName(name) {
    this.onChange({ name });
  }

  onChangeDescription(description) {
    this.onChange({ description });
  }

  editImages() {
    this.props.storesActions.editProductImages(this.props.product);
  }

  normalizeImagesToSave(imagesToSave, images) {
    const newImages = _.unionBy(imagesToSave, images, 'sequence');
    const { data } = this.state;
    const newData = {
      ...data,
      images: newImages,
    };
    return newData;
  }

  async onPressButton() {
    const { jwt, product, storesActions } = this.props;
    const { imagesToSave = [], images = [] } = this.state.data;

    // Get all images to salve and send to storage
    const imagesToResolve = imagesToSave
      .map(image =>
        storesActions
          .sendImage(image.signed_url, image.path, image.mimetype));

    const resolved = await Promise.all(imagesToResolve);

    const hasError = resolved.find(request => request === false);
    if (!hasError) {
      const data = this.normalizeImagesToSave(imagesToSave, images);
      const createOrUpdate = product.id
        ? storesActions.updateProduct
        : storesActions.createProduct;
      createOrUpdate(jwt, data);
    } else {
      ApiUtils.error('Houve um problema ao enviar as imagens, o produto não será salvo.');
    }
  }

  render() {
    const { images } = this.state.data;
    const marginTop = images.length ? 0 : 65;
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <IconButton
          onPress={this.props.navActions.back}
          iconName={'arrow-left'}
          style={stylesHeader.backButton}
          iconStyle={stylesHeader.backButtonIcon}
        />
        <IconButton
          onPress={this.editImages}
          iconName={'image'}
          style={stylesHeader.rightButton}
          iconStyle={stylesHeader.backButtonIcon}
        />
        <Container style={styles.container}>
          <Content>
            <Form style={{ marginTop }}>
              { this.state.uploading
              ? <Spinner />
              : images.length > 0 && (
                <Carousel
                  style={styles.carrousel}
                  pageStyle={styles.slide}
                  autoplay={false}
                  pageInfo
                >
                  { images.map(image => (
                    <View key={`product-${image.sequence}`} style={styles.slide}>
                      <Lightbox
                        activeProps={{ ...lightboxStyle }}
                        backgroundColor={'#fff'}
                        underlayColor={'#fff'}
                        onClose={() => StatusBar.setHidden(true, 'fade')}
                      >
                      <FastImage
                        style={styles.image}
                        source={{ uri: image.url }}
                        resizeMode={'contain'}
                      />
                      </Lightbox>
                    </View>
                  )) }
                </Carousel>
              )}
              <Item stackedLabel>
                <Label>Nome</Label>
                <Input
                  value={this.state.data.name}
                  onChangeText={this.onChangeName}
                  onBlur={() => this.props.storesActions.onChangeProduct(this.state.data)}
                />
              </Item>
              <Item stackedLabel>
                <Label>Descrição</Label>
                <Input
                  value={this.state.data.description}
                  onChangeText={this.onChangeDescription}
                  onBlur={() => this.props.storesActions.onChangeProduct(this.state.data)}
                />
              </Item>
              <View style={{ marginTop: 10, marginLeft: 15, marginBottom: 10 }}>
                <Label style={{ color: 'gray', fontSize: 15 }}>Tamanhos</Label>
              </View>
              <SizePicker
                sizes={this.state.data.sizes}
                onEdit={this.props.storesActions.editProductSize}
                onClose={this.props.storesActions.removeSize}
              />
            </Form>
          </Content>
        </Container>
        <Button
          disabled={this.state.uploading}
          full
          dark={!this.state.uploading}
          onPress={this.onPressButton}
        >
          <Text>Salvar</Text>
        </Button>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    product: state.myStores.product,
    storeId: state.myStores.store.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    storesActions: bindActionCreators(StoresActions, dispatch),
  };
}

ProductEdit.propTypes = {
  jwt: PropTypes.string.isRequired,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.Array,
    sizes: PropTypes.Array,
    store_id: PropTypes.number,
    presigned_url: PropTypes.string,
    uploading: PropTypes.bool,
    loadingRequest: PropTypes.bool,
    image_path: PropTypes.string,
  }).isRequired,
  storeId: PropTypes.number.isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
  storesActions: PropTypes.shape({
    requestProductSignedURL: PropTypes.func.isRequired,
    sendImage: PropTypes.func.isRequired,
    updateProduct: PropTypes.func.isRequired,
    createProduct: PropTypes.func.isRequired,
    onChangeProduct: PropTypes.func.isRequired,
    editProductImages: PropTypes.func.isRequired,
    editProductSize: PropTypes.func.isRequired,
    removeSize: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit);
