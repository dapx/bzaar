import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
    const { images } = nextProps.product;
    this.setState({ images });
  }

  async onReceiveData(data) {
    const { storesActions } = this.props;
    const { sequence } = data;
    storesActions
      .requestProductImagesSignedURL(this.props.jwt, data, this.props.product, sequence);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <HeaderBack
          title={'Images'}
          back={this.props.navActions.back}
        />
        <ImageGallery
          images={this.state.images}
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
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductImages);
