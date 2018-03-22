import React, { Component } from 'react';
import { Header, Left, Body, Right, Title } from 'native-base';
import _ from 'lodash';
import PropTypes from 'prop-types';
import IconButton from './iconButton';

class HeaderBack extends Component {

  render() {
    return (
      <Header style={{ borderBottomColor: '#ddd' }}>
        <Left>
          <IconButton
            style={{ backgroundColor: 'transparent' }}
            iconStyle={{ color: 'black' }}
            iconName="arrow-left"
            onPress={this.props.back}
          />
        </Left>
        <Body>
          <Title style={{ color: 'black' }}>{this.props.title}</Title>
        </Body>
        <Right />
      </Header>
    );
  }
}

HeaderBack.propTypes = {
  back: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default HeaderBack;
