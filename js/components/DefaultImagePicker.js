import React, { Component } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import PropTypes from 'prop-types';

class DefaultImagePicker extends Component {
  constructor(props) {
    super(props);
    const width = props.width || 400;
    const height = props.height || 400;
    const cropping = !!props.cropping;
    const maxSize = props.maxSize || 1.5;
    this.state = {
      megaByte: 1000000,
      options: {
        mediaType: 'photo',
        width,
        height,
        cropping,
        maxSize,
      },
    };
  }

  getImageName(file) {
    return Platform.OS === 'ios' ? file.filename : file.path.split('/').pop();
  }

  isValidFormat(mimetype) {
    const isJPG = mimetype === 'image/jpg' || mimetype === 'image/jpeg';
    const isPNG = mimetype === 'image/png';
    return !isJPG && !isPNG;
  }

  isValidSize(fileSize) {
    return fileSize > (this.state.maxSize * this.state.megaByte);
  }

  onPress = () => {
    this.props.onPress();
    return ImagePicker.openPicker(this.state.options).then((file) => {
      const imageName = this.getImageName(file);
      const mimetype = file.mime;
      const metaDataImage = { image_name: imageName, mimetype, path: file.path };

      if (this.isValidSize(file.size)) return this.props.onMaxSize();
      if (this.isValidFormat(mimetype)) return this.props.onUnsupported();
      return this.props.onReceiveData(metaDataImage);
    }).catch(error => this.props.onError(error));
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress}>
        { this.props.children }
      </TouchableOpacity>
    );
  }
}

DefaultImagePicker.propTypes = {
  children: PropTypes.element.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  maxSize: PropTypes.number,
  cropping: PropTypes.bool,
  onUnsupported: PropTypes.func.isRequired,
  onMaxSize: PropTypes.func.isRequired,
  onReceiveData: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
};

export default DefaultImagePicker;
