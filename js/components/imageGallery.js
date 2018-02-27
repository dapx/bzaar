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

const Slot = ({ EmptyComponent, style, url, sequence }) => {
  return url
    ? <FastImage
        style={style}
        key={`slot-seq-${sequence}`}
        source={{ uri: url }}
        resizeMode={'cover'}
    />
    : <EmptyComponent style={style} key={`slot-seq-${sequence}`} />;
};

Slot.propTypes = {
  url: PropTypes.string,
  sequence: PropTypes.number.isRequired,
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
    this.onReceiveData = this.onReceiveData.bind(this);
  }

  sortBySeq(images) {
    return images.sort((a, b) => a.sequence - b.sequence);
  }

  fillSlots(images, emptySlots) {
    return _.unionBy(images, emptySlots, 'sequence');
  }

  onReceiveData(data) {
    console.log(data);
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
      { this.state.slots.map(image => (
        <DefaultImagePicker
          key={`image-${image.sequence}`}
          width={400}
          height={400}
          onReceiveData={this.onReceiveData}
        >
          <Slot
            style={styles.slots}
            sequence={image.sequence}
            url={image.url}
            EmptyComponent={EmptySlot}
          />
        </DefaultImagePicker>
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
};

export default ImageGallery;
