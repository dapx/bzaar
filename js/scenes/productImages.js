import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';
import HeaderBack from '../components/headerBack';
import ImageGallery from '../components/imageGallery';

class ProductImages extends Component {
  constructor(props) {
    super(props);
    const { images } = props.product;
    this.state = {
      images,
    };
    this.onReceiveData = this.onReceiveData.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { images, slots } = nextProps.product;
    this.setState({ images, slots });
  }

  /**
   *  It is used by DefaultImagePicker.
   *  It's necessary to pass the items state to doesn't lost the slots coordinates.
   *
   *  @param data Image object from local system with slot sequence
   *  @param items Current items state to use in redux
   */
  onReceiveData(data, items) {
    const { storesActions } = this.props;
    const { sequence } = data;
    storesActions
      .requestProductImagesSignedURL(this.props.jwt, data, this.props.product, sequence, items);
  }

  onChange = (slots, itemToChange, action = 'UPDATE') => {
    const productId = this.props.product.id;
    const newSlots = this.slotsReducer({ slots, itemToChange }, action);
    this.props.storesActions.changeImageSequence(productId, newSlots);
  }

  slotsReducer({ slots, itemToChange }, action) {
    switch (action) {
      case 'DELETE': {
        const itemToRemoveIndex = slots.findIndex(i => i.key === itemToChange.key);
        const item = _.omit(itemToChange, 'url');
        return [
          ...slots.slice(0, itemToRemoveIndex),
          item,
          ...slots.slice(itemToRemoveIndex + 1),
        ];
      }

      default: {
        return slots.map((item, index) => {
          const sequence = index + 1;
          const newSlotSequence = {
            ...item,
            sequence,
          };
          return newSlotSequence;
        });
      }
    }
  }

  render() {
    const { images = [], slots = [] } = this.state;
    const allSlots = [...images, ...slots];
    return (
      <View style={{ flex: 1 }}>
        <HeaderBack
          title={'Images'}
          back={this.props.navActions.back}
        />
        <ImageGallery
          images={allSlots}
          slots={slots}
          onChange={this.onChange}
          onReceiveData={this.onReceiveData}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    product: state.myStores.product,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    storesActions: bindActionCreators(StoresActions, dispatch),
  };
}

ProductImages.propTypes = {
  jwt: PropTypes.string,
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    images: PropTypes.Array,
    sizes: PropTypes.Array,
    store_id: PropTypes.number.isRequired,
  }),
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
  storesActions: PropTypes.shape({
    requestProductImagesSignedURL: PropTypes.func.isRequired,
    changeImageSequence: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductImages);
