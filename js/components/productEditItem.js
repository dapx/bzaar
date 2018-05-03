import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from 'native-base';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Button from '../components/button';

import { getDeviceWidth } from '../styles';

const styles = StyleSheet.create({
  storeUniqueImage: {
    width: getDeviceWidth(35),
    height: getDeviceWidth(35),
    alignSelf: 'center',
  },
});

class ProductItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    const { item, onPressItem } = this.props;
    let itemToOpen = {
      id: 0, name: '', description: '', sizes: [], images: [],
    };
    const isNew = item.id === 0;
    if (!isNew) itemToOpen = item;
    onPressItem(itemToOpen);
  }

  render() {
    const { item } = this.props;
    let uri = 'https://png.icons8.com/dusk/1600/new-product.png';
    let name = 'Adicionar';
    const isNew = item.id === 0;
    if (!isNew) {
      const image = item.images[0];
      name = item.name; // eslint-disable-line prefer-destructuring
      uri = (image && image.url) || 'https://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder.png';
    }
    return (
      <Button
        key={`product-store-${item.id}`}
        style={{ flex: 1 }}
        onPress={this.onPress}
      >
        <Card>
          <FastImage
            style={styles.storeUniqueImage}
            source={{ uri }}
            resizeMode={'contain'}
          />
          <Text style={{ textAlign: 'center' }}>{`${name}`}</Text>
        </Card>
      </Button>
    );
  }
}

ProductItem.propTypes = {
  item: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

export default ProductItem;
