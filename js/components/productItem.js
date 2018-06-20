import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from 'native-base';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import Button from '../components/button';
import { Price } from '../utils/utils';

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
    const image = item.images[0];
    const lowerPrice = Price.format(item.sizes[0].price);
    const uri = (image && image.url) || 'https://www.pixedelic.com/themes/geode/demo/wp-content/uploads/sites/4/2014/04/placeholder.png';
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
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{ textAlign: 'center' }}>
              {`${item.name}`}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'tail'}
            style={{ textAlign: 'center', color: 'green', margin: 10 }}>
              {`A partir de ${lowerPrice}`}
          </Text>
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
