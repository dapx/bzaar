import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ImageSlider from 'react-native-image-slider';
import * as Actions from '../actions/store';
import * as NavActions from '../actions/navigation';

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      position: 1,
      interval: null,
      imageList: [
        'https://www.smashingmagazine.com/images/wildlife/susp.jpg',
        'https://www.smashingmagazine.com/images/wildlife/golden.jpg',
        'https://en.bcdn.biz/Images/2016/5/18/2fa8fc5a-f2bb-4404-92e8-efc6ec53adb6.jpg',
      ],
    };
  }

  componentWillMount() {
    this.setState({ interval: setInterval(() => {
      this.setState({ position: this.state.position === 2 ? 0 : this.state.position + 1 });
    }, 5000) });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    return (
      <View>
        <ImageSlider
          images={this.state.imageList}
          position={this.state.position}
          onPositionChanged={position => this.setState({ position })}
        />
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    store: state.store,
    jwt: state.login.jwt,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    storeActions: bindActionCreators(Actions, dispatch),
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Product);
