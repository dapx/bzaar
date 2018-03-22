import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import _ from 'lodash';
import DefaultImagePicker from './DefaultImagePickerWithErrorHandler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  slots: {
    width: 95,
    height: 95,
    backgroundColor: '#ddd',
    borderRadius: 15,
    margin: 5,
  },
});

const EmptySlot = ({ style }) => (
  <View style={[style, { justifyContent: 'center' }]}>
    <Text style={{ textAlign: 'center', fontSize: 30 }}>+</Text>
  </View>
);

EmptySlot.propTypes = {
  style: View.propTypes.style,
};

class Slot extends Component {
  constructor(props) {
    super(props);
    this.onReceiveImage = this.onReceiveImage.bind(this);
  }

  onReceiveImage(image) {
    const { onReceiveData, sequence } = this.props;
    const data = { ...image, sequence };
    onReceiveData(data);
  }

  render() {
    const { EmptyComponent, style, url, width, height } = this.props;
    return (
      <DefaultImagePicker
        width={width}
        height={height}
        cropping={true}
        onReceiveData={this.onReceiveImage}
      >
      { url
        ? <FastImage
            style={style}
            source={{ uri: url }}
            resizeMode={'cover'}
        />
        : <EmptyComponent style={style} />
      }
      </DefaultImagePicker>
    );
  }
}

Slot.propTypes = {
  url: PropTypes.string,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sequence: PropTypes.number.isRequired,
  onReceiveData: PropTypes.func.isRequired,
  EmptyComponent: PropTypes.func.isRequired,
  style: FastImage.propTypes.style,
};

/**
 * It renders the product images to change order and to add new.
 */
class ImageGallery extends Component {

  constructor(props) {
    super(props);
    const images = this.sortBySeq(props.images);
    const emptySlots = [
      { sequence: 1 },
      { sequence: 2 },
      { sequence: 3 },
      { sequence: 4 },
      { sequence: 5 },
      { sequence: 6 },
      { sequence: 7 },
      { sequence: 8 },
      { sequence: 9 },
    ];
    const slots = this.fillSlots(images, emptySlots);
    this.state = {
      slots,
    };
  }

  componentWillReceiveProps(nextProps) {
    const images = this.sortBySeq(nextProps.images);
    const slots = this.fillSlots(images, this.state.slots);
    this.setState({ slots });
  }

  sortBySeq(images) {
    return images.sort((a, b) => a.sequence - b.sequence);
  }

  fillSlots(images, emptySlots) {
    return _.unionBy(images, emptySlots, 'sequence');
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
      { this.state.slots.map(image => (
        <Slot
          key={`image-${image.sequence}`}
          width={400}
          height={400}
          onReceiveData={this.props.onReceiveData}
          style={styles.slots}
          sequence={image.sequence}
          url={image.url}
          EmptyComponent={EmptySlot}
        />
      ))}
      </ScrollView>
    );
  }
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      sequence: PropTypes.number.isRequired,
    }),
  ).isRequired,
  onReceiveData: PropTypes.func.isRequired,
};

export default ImageGallery;
