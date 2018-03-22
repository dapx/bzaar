import React, { Component } from 'react';
import { Button } from 'native-base';
//import PropTypes from 'prop-types';
import _ from 'lodash';

class ButtonDebounced extends Component {
  constructor(props) {
    super(props);
    this.onPress = _.debounce(
      props.onPress,
      300,
      { leading: true, trailing: false },
    ).bind(this);
  }

  render() {
    const { onPress, props } = this;
    const nextProps = { ...props, onPress };
    console.log('Next props ', nextProps);
    return (
      <Button { ...nextProps }>
        { this.props.children }
      </Button>
    );
  }
}

//ButtonDebounced.propTypes = Button.propTypes;

export default ButtonDebounced;
