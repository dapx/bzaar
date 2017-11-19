import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Header, Left, Button, Icon, Title, Content, Body, Footer, Form, Input, Item, Label, Text, Spinner } from 'native-base';
import { Text as TextBase } from 'native-base';
import PropTypes from 'prop-types';
import ImagePicker from 'react-native-image-picker';
import HeaderBack from '../components/headerBack';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import * as style from '../styles/index';
import { ApiUtils } from '../utils/api';

const imageWidth = style.getDeviceWidth(100);
const imageHeight = style.getDeviceHeight(30);
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
  description: {
    flex: 2,
    flexDirection: 'column',
  },
  info: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    opacity: 0.8,
  },
  currency: {
    flex: 2,
    alignItems: 'center',
  },
  currencyText: {
    fontSize: 20,
    color: 'white',
  },
  buyButton: {
    color: 'white',
  },
  footerButton: {
    flex: 2,
    justifyContent: 'center',
  },
});

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
    const hasImage = this.state.logo.length > 0;
    const uri = hasImage
      ? this.state.logo
      : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWPbrAYB2nxO2MTkMlVPkWfccHoott1Eu5NaLsdYjOFHpvStMO';
    const resizeMode = 'contain';
    return this.state.uploading  
    ? <Spinner />
    : (<TouchableOpacity onPress={this.onPressImage}>
      <Image style={{
          width: imageWidth,
          height: imageHeight,
          resizeMode,
        }}
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
      this.props.storesActions.createStore(this.state.jwt, storeData)
        .then(() => this.setState({isNew: false}));

    } else {
      this.props.storesActions.sendImage(signedURL, image_data, this.state.mimetype)
        .then(() =>
          this.props.storesActions.updateStore(this.state.jwt, storeData)
        );
    }
  }

  onPressImage() {
    const options = {
      title: 'Select Store Image',
      storageOptions: {
        skipBackup: true,
        noData: true,
        path: 'images'
      }
    };
    ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          ApiUtils.error('Escolha de imagem cancelada.');
        }
        else if (response.error) {
          ApiUtils.error('ImagePicker Error: ' + response.error);
        }
        else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        }
        else {
          const logo = response.uri;
          const fileSize = response.fileSize;
          const megaByte = 1000000;
          if (fileSize > (1.5 * megaByte)) {
            ApiUtils.error('Imagem muito grande, tente diminuir a qualidade da imagem.')
          } else {
            const image_name = response.fileName;
            const mimetype = `image/${image_name.split('.').pop().toLowerCase()}`
            console.log(mimetype);
            if (mimetype !== 'image/jpg' && mimetype !== 'image/png') {
              ApiUtils.error('A imagem não corresponde aos formatos permitidos. Os formatos permitidos são JPG ou PNG.');
            } else {
              const metaDataImage = { id: this.state.id, image_name, mimetype };
              this.props.storesActions.requestSignedURL(this.state.jwt, metaDataImage).then((data) => {
                this.setState({
                  isNew: false,
                  logo,
                  mimetype,
                });  
              });
            }
          }
        }
    })
  }

  render() {
    const storeName = this.state.name;
    return (
      <Container style={styles.container}>
        <HeaderBack title={`Edit ${storeName}`} back={() => this.props.navActions.back()} />
        <Content style={{flex: 1}}>
          { !this.state.isNew && this.renderImage() }
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
