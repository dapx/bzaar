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

class StoreEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: 0,
        name: '',
        description: '',
        logo: '',
        email: '',
      },
      isNew: true,
      presigned_url: '',
      mimetype: '',
      image_path: '',
      loadingRequest: false,
      uploading: false,
      wasChangedImage: false,
    };
    this.onPressImage = this.onPressImage.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount() {
    const isNew = this.props.store.id === 0;
    this.setState({
      jwt: this.props.jwt,
      data: this.props.store,
      isNew,
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      presigned_url: nextProps.store.presigned_url,
      uploading: !!nextProps.store.uploading,
      loadingRequest: !!nextProps.store.loadingRequest,
      image_path: nextProps.store.image_path,
    });
  }

  onPressButton() {
    const signedURL = this.state.presigned_url;
    const imageData = this.state.data.logo;
    const storeData = {
      id: this.state.id,
      name: this.state.name,
      description: this.state.description,
      email: this.state.email,
      logo: imageData,
    };
    const isNew = this.state.isNew;
    if (isNew) {
      this.props.storesActions.createStore(this.state.jwt, storeData);
    } else {
      const wasChangedImage = this.state.wasChangedImage;
      if (wasChangedImage) {
        this.props.storesActions.sendImage(signedURL, imageData, this.state.mimetype)
          .then(() =>
            this.props.storesActions.updateStore(this.state.jwt, { store:
              { ...storeData, logo: this.state.image_path },
            }),
          );
      } else {
        this.props.storesActions.updateStore(this.state.jwt, { store: storeData });
      }
    }
  }

  onChange(object) {
    const data = { ...this.state.data, ...object };
    this.setState({ data });
  }

  onReceiveData(metaData) {
    const store = this.state.data;
    this.props.storesActions.requestStoreSignedURL(this.props.jwt, metaData, store)
      .then(() => {
        const data = { ...store, logo: metaData.path };
        this.setState({
          isNew: false,
          wasChangedImage: true,
          data,
          mimetype: metaData.mimetype,
        });
      });
  }

  renderImage() {
    const uri = this.state.data.logo;
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
    </DefaultImagePicker>);
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
    const storeName = this.state.data.name;
    const isNew = this.state.isNew;
    return (
      <Container style={styles.container}>
        <HeaderBack title={`Edit ${storeName}`} back={() => this.props.navActions.back()} />
        <Content style={{ flex: 1 }}>
          { !isNew && this.renderImage() }
          <Form style={{ flex: 2 }}>
            <Item stackedLabel>
              <Label>Nome da Loja</Label>
              <Input value={this.state.data.name} onChangeText={name => this.onChange({ name })} />
            </Item>
            <Item stackedLabel>
              <Label>Descrição da Loja</Label>
              <Input
                value={this.state.data.description}
                onChangeText={description => this.onChange({ description })}
              />
            </Item>
            <Item stackedLabel>
              <Label>E-mail da Loja</Label>
              <Input
                value={this.state.data.email}
                onChangeText={email => this.onChange({ email })} />
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
    store: state.myStores.store,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    storesActions: bindActionCreators(StoresActions, dispatch),
  };
}

StoreEdit.propTypes = {
  jwt: PropTypes.string.isRequired,
  store: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
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
    requestStoreSignedURL: PropTypes.func.isRequired,
    sendImage: PropTypes.func.isRequired,
    updateStore: PropTypes.func.isRequired,
    createStore: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreEdit);
