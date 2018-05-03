import React, { Component } from 'react';
import { View, Text, StyleSheet, InteractionManager } from 'react-native';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import AnimatedDND from 'react-native-animated-dnd';
import { Icon } from 'native-base';
import _ from 'lodash';
import DefaultImagePicker from './DefaultImagePickerWithErrorHandler';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  area: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderColor: 'transparent',
    borderRadius: 0,
    borderWidth: 0,
    marginTop: 10,
  },
  slots: {
    width: 95,
    height: 95,
    backgroundColor: '#ddd',
    borderRadius: 94 / 4,
    margin: 2,
  },
  delete: {
    backgroundColor: '#ddd',
    borderRadius: 100,
    flex: 1,
    padding: 20,
    margin: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
});

class DeleteItem extends React.PureComponent {
  render() {
    const { active } = this.props;
    return (
      <View style={styles.delete}>
        { active
          ? (<Icon
            style={{ textAlign: 'center' }}
            name="trash-2"
          />)
          : <Text style={{ textAlign: 'center' }}>Release here to delete</Text>
        }
      </View>
    );
  }
}

DeleteItem.propTypes = {
  active: PropTypes.bool.isRequired,
};

class Item extends Component {
  onReceiveImage = (image) => {
    const { item: { sequence }, onPress } = this.props;
    const data = { ...image, sequence };
    onPress(data);
  }

  render() {
    const { item: { isBeingDragged, key, url } } = this.props;
    const width = 95;
    const height = 95;
    const style = isBeingDragged
      ? { width, height, borderRadius: width / 4 }
      : { width, height, borderRadius: width / 4 };
    return (
      <DefaultImagePicker
        key={key}
        style={[styles.slots, style]}
        width={width}
        height={height}
        cropping={true}
        onReceiveData={this.onReceiveImage}
      >
        <FastImage
          style={style}
          source={{ uri: url }}
          resizeMode={'cover'}
        />
      </DefaultImagePicker>
    );
  }
}

Item.propTypes = {
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number, PropTypes.array]),
  item: PropTypes.shape({
    isBeingDragged: PropTypes.bool,
    key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    url: PropTypes.string,
    sequence: PropTypes.number,
  }).isRequired,
  onPress: PropTypes.func,
};

const allKeys = [9, 8, 7, 6, 5, 4, 3, 2, 1];

/**
 * It renders the product images to change order and to add new.
 */
class ImageGallery extends Component {
  constructor(props) {
    super(props);
    // TODO - It needs to be refactored, I think it should be removed from constructor
    const previousSlots = _.unionBy(this.normalizeSlots(props.slots || emptySlots), emptySlots, 'sequence');
    const filledSlots = this.fillSlots(props.images, previousSlots);
    const keys = this.getAvailableKeys(allKeys, props.images);
    const normalizedSlots = this.normalizeSlotsBasedOnKeyList(filledSlots, keys);
    const slots = this.sortBySeq(normalizedSlots);
    this.state = {
      slots,
      ready: false,
      previousSlots,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => this.setState({ ready: true }));
  }

  componentWillReceiveProps(nextProps) {
    // fill slots by sequence with normalized images based on previous state
    const filledSlots = _.unionBy(nextProps.images, this.previousSlots, 'sequence');
    // Set key to slots
    const keys = this.getAvailableKeys(allKeys, filledSlots);
    const normalizedSlots = this.normalizeSlotsBasedOnKeyList(filledSlots, keys);

    // order by sequence
    const slots = this.sortBySeq(normalizedSlots);
    this.setState({ slots });
  }

  sortBySeq(images) {
    return images.sort((a, b) => a.sequence - b.sequence);
  }

  fillSlots(images, slots) {
    return _.unionBy(images, slots, 'sequence');
  }

  /**
   *  Filter images looking for available keys
   */
  getAvailableKeys(keysList, images) {
    return keysList.map((k) => {
      const image = images.find(i => (i.key === k));
      return !image && k;
    }).filter(k => k);
  }

  // Just used to create a key when receive the first images
  normalizeSlots(images) {
    return images.map((image) => {
      const key = image.key || image.sequence;
      return ({ ...image, key });
    });
  }

  // Set an available key for slots/images without it.
  normalizeSlotsBasedOnKeyList(images, keyList) {
    return images.map((image) => {
      const key = image.key || keyList.pop();
      return ({ ...image, key });
    });
  }

  render() {
    return (this.state.ready)
      ? (
        <AnimatedDND
          animationDuration={250}
          style={styles.container}
          styleArea={styles.area}
          styleWrapper={styles.slots}
          items={this.state.slots}
          onPressAddNewItem={() => {}}
          onPressItem={this.props.onReceiveData}
          onChange={this.props.onChange}
          ItemElement={Item}
          DeleteElement={DeleteItem}
        />
      ) : (
      <View style={styles.container}>
      </View>
      );
  }
}

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes
    .shape({
      url: PropTypes.string,
      sequence: PropTypes.number.isRequired,
    })).isRequired,
  slots: PropTypes.arrayOf(PropTypes
    .shape({
      key: PropTypes.number,
      sequence: PropTypes.number.isRequired,
    })),
  onChange: PropTypes.func.isRequired,
  onReceiveData: PropTypes.func.isRequired,
};

export default ImageGallery;
