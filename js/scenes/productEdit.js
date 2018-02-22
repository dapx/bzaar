import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Button, Content, Form, Input, Item, Label, Text, Spinner } from 'native-base';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import DefaultImagePicker from '../components/DefaultImagePickerWithErrorHandler';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import { storeEdit } from '../styles/index';

const styles = StyleSheet.create(storeEdit);

class ProductEdit extends Component {
  constructor(props) {
    super(props);
    console.log(props.product);
    const price = `${props.product.price}`;
    this.state = {
      data: {
        id: props.product.id,
        name: props.product.name,
        description: props.product.description,
        image: props.product.image,
        price,
        store_id: props.product.store_id,
      },
      presigned_url: '',
      mimetype: '',
      image_path: '',
      loadingRequest: false,
      uploading: false,
      wasChangedImage: false,
    };
    this.onPressButton = this.onPressButton.bind(this);
    this.onReceiveData = this.onReceiveData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      jwt: nextProps.jwt,
      data: nextProps.product,
      presigned_url: nextProps.product.presigned_url,
      uploading: !!nextProps.product.uploading,
      loadingRequest: !!nextProps.product.loadingRequest,
      image_path: nextProps.product.image_path,
    });
  }

  onChange(object) {
    const data = { ...this.state.data, ...object };
    this.setState({ data });
  }

  onPressButton() {
    const signedURL = this.state.presigned_url;
    const imageData = this.state.data.image;
    this.props.storesActions.sendImage(
      signedURL, imageData, this.state.mimetype,
    );
  }

  onReceiveData(metaData) {
    const product = this.state.data;
    this.props.storesActions.requestProductSignedURL(this.props.jwt, metaData, product)
      .then(() => {
        const data = { ...product, image: metaData.path };
        this.setState({
          isNew: false,
          wasChangedImage: true,
          data,
          mimetype: metaData.mimetype,
        });
      });
  }

  renderImage() {
    const uri = this.state.data.image;
    return this.state.uploading
    ? <Spinner />
    : (
      <DefaultImagePicker
        width={400}
        height={400}
        maxSize={1.5}
        cropping={true}
        onReceiveData={this.onReceiveData}
      >
        <Image
          style={styles.image}
          source={{ uri, cache: 'force-cache' }}
        />
      </DefaultImagePicker>
    );
  }

  renderButton() {
    return (
      <Button
        disabled={this.state.uploading}
        full
        dark={!this.state.uploading}
        onPress={this.onPressButton}
      >
        <Text>Salvar</Text>
      </Button>
    );
  }

  render() {
    const isNew = this.props.product.id === 0;
    return (
      <Container style={styles.container}>
        <HeaderBack
          title={`Produto ${this.state.data.name}`}
          back={() => this.props.navActions.back()}
        />
        <Content style={{ flex: 1 }}>
          { !isNew && this.renderImage() }
          <Form style={{ flex: 2 }}>
            <Item stackedLabel>
              <Label>Nome</Label>
              <Input
                value={this.state.data.name}
                onChangeText={name => this.onChange({ name })}
              />
            </Item>
            <Item stackedLabel>
              <Label>Descrição</Label>
              <Input
                value={this.state.data.description}
                onChangeText={description => this.onChange({ description })}
              />
            </Item>
            <Item stackedLabel>
              <Label>Preço</Label>
              <Input
                value={this.state.data.price}
                onChangeText={price => this.onChange({ price })}
              />
            </Item>
          </Form>
          { this.renderButton() }
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    product: state.myStores.product,
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
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    store_id: PropTypes.number.isRequired,
    presigned_url: PropTypes.string,
    uploading: PropTypes.bool,
    loadingRequest: PropTypes.bool,
    image_path: PropTypes.string,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
  storesActions: PropTypes.shape({
    requestProductSignedURL: PropTypes.func.isRequired,
    sendImage: PropTypes.func.isRequired,
    updateProduct: PropTypes.func.isRequired,
    createProduct: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductEdit);
