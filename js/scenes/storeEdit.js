import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity, Platform } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Left, Button, Icon, Title, Content, Body, Footer, Form, Input, Item, Label, Text, Spinner } from 'native-base';
import { Text as TextBase } from 'native-base';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-crop-picker';
import HeaderBack from '../components/headerBack';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import { storeEdit } from '../styles/index';
import { ApiUtils } from '../utils/api';

const styles = StyleSheet.create(storeEdit);

class StoreEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: '',
      description: '',
      logo: '',
      email: '',
      isNew: true,
      presigned_url: '',
      image_data: '',
      mimetype: '',
      image_path: '',
      loadingRequest: false,
      uploading: false,
    };
    this.onPressImage = this.onPressImage.bind(this);
    this.onPressButton = this.onPressButton.bind(this);
  }

  componentDidMount() {
    const isNew = this.props.store.id === 0;
    this.setState({
      jwt: this.props.jwt,
      ...this.props.store,
      isNew
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

  renderButton() {
    return (
      <Button disabled={this.state.uploading}
        full
        dark={!this.state.uploading}
        onPress={this.onPressButton}
      >
        <Text>Salvar</Text>
      </Button>
    );
  }

  renderImage() {
    const uri = this.state.logo
    return this.state.uploading  
    ? <Spinner />
    : (<TouchableOpacity onPress={this.onPressImage}>
      <Image style={styles.image}
        source={{ uri }} 
      />
    </TouchableOpacity>);
  }

  onPressButton() {
    const signedURL = this.state.presigned_url;
    const image_data = this.state.logo;
    const storeData = {
      store: {
        id: this.state.id,
        name: this.state.name,
        description: this.state.description,
        logo: this.state.image_path,
        email: this.state.email,
      },
    }
    const isNew = this.state.isNew;
    if (isNew) {
      this.props.storesActions.createStore(this.state.jwt, storeData);
    } else {
      this.props.storesActions.sendImage(signedURL, image_data, this.state.mimetype)
        .then(() =>
          this.props.storesActions.updateStore(this.state.jwt, storeData)
        );
    }
  }

  onPressImage() {
    const options = {
      mediaType: 'photo',
      width: 400,
      height: 400,
      cropping: true,
    };
    ImagePicker.openPicker(options).then(response => {
      const logo = response.path;
      const fileSize = response.size;
      const megaByte = 1000000;
      if (fileSize > (1.5 * megaByte)) {
        ApiUtils.error('Imagem muito grande, tente diminuir a qualidade da imagem.')
      } else {
        const imageName = Platform.OS === 'ios' ? response.filename : response.path.split('/').pop();
        const mimetype = response.mime;
        if (mimetype !== 'image/jpg' && mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
          ApiUtils.error('A imagem não corresponde aos formatos permitidos. Os formatos permitidos são JPG ou PNG.');
        } else {
          const metaDataImage = { id: this.state.id, image_name: imageName, mimetype };
          this.props.storesActions.requestSignedURL(this.state.jwt, metaDataImage).then((data) => {
            this.setState({
              isNew: false,
              logo,
              mimetype,
            });
          });
        }
      }
    });
  }

  render() {
    const storeName = this.state.name;
    const isNew = this.state.isNew;
    return (
      <Container style={styles.container}>
        <HeaderBack title={`Edit ${storeName}`} back={() => this.props.navActions.back()} />
        <Content style={{flex: 1}}>
          { !isNew && this.renderImage() }
          <Form style={{flex: 2}}>
            <Item stackedLabel>
              <Label>Nome da Loja</Label>
              <Input value={this.state.name} onChangeText={name => this.setState({name})} />
            </Item>
            <Item stackedLabel>
              <Label>Descrição da Loja</Label>
              <Input value={this.state.description} onChangeText={description => this.setState({description})} />
            </Item>
            <Item stackedLabel>
              <Label>E-mail da Loja</Label>
              <Input value={this.state.email} onChangeText={email => this.setState({email})} />
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
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
  }).isRequired,
  storesActions: PropTypes.shape({
    requestSignedURL: PropTypes.func.isRequired,
    sendImage: PropTypes.func.isRequired,
    updateStore: PropTypes.func.isRequired,
    createStore: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(StoreEdit);
