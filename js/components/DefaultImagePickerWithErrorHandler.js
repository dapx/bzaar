import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DefaultImagePicker from './DefaultImagePicker';
import { ApiUtils } from '../utils/api';

class DefaultImagePickerWithErrorHandler extends Component {
  onMaxSize() {
    ApiUtils.error('Imagem muito grande, tente diminuir a qualidade da imagem.');
  }

  onUnsupported() {
    ApiUtils.error('A imagem não corresponde aos formatos permitidos. Os formatos permitidos são JPG ou PNG.');
  }

  onError(error) {
    ApiUtils.error(`Ocorreu um erro ao buscar a imagem: ${error}`);
  }

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
  width: PropTypes.number,
  height: PropTypes.number,
  maxSize: PropTypes.number,
  cropping: PropTypes.bool,
};

export default DefaultImagePickerWithErrorHandler;
