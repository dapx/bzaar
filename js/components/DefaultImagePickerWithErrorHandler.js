import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefaultImagePicker from './DefaultImagePicker';
import { ApiUtils } from '../utils/api';

class DefaultImagePickerWithErrorHandler extends Component {
  throwError(error) {
    if (this.props.onError) this.props.onError();
    ApiUtils.error(error);
  }

  onMaxSize = () => {
    this.throwError('Imagem muito grande, tente diminuir a qualidade da imagem.');
  }

  onUnsupported = () => {
    this.throwError('A imagem não corresponde aos formatos permitidos. Os formatos permitidos são JPG ou PNG.');
  }

  onError = error => this.throwError(`Ocorreu um erro ao buscar a imagem: ${error}`);

  render() {
    return (
      <DefaultImagePicker
        {...this.props}
        onMaxSize={this.onMaxSize}
        onUnsupported={this.onUnsupported}
        onError={this.onError}
      />
    );
  }
}

DefaultImagePickerWithErrorHandler.propTypes = {
  children: PropTypes.element.isRequired,
  onReceiveData: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  maxSize: PropTypes.number,
  cropping: PropTypes.bool,
  onError: PropTypes.func,
  onPress: PropTypes.func,
};

export default DefaultImagePickerWithErrorHandler;
