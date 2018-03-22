import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import _ from 'lodash';

class Button extends Component {
  constructor(props) {
    super(props);
    this.onPress = _.debounce(
      props.onPress,
      300,
      { leading: true, trailing: false },
    ).bind(this);
  }

  render() {
    const { style, children } = this.props;
    return (
      <View style={style}>
      <TouchableOpacity onPress={this.onPress}>
        <View>
          { children }
        </View>
      </TouchableOpacity>
      </View>
    );
  }
}

Button.propTypes = {
  style: View.propTypes.style,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.object.isRequired,
};

export default Button;
