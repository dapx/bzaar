import React, { Component } from 'react';
import { Header, Left, Body, Right, Button, Icon, Title } from 'native-base';
import _ from 'lodash';
import PropTypes from 'prop-types';

class HeaderBack extends Component {

  render() {
    return (
      <Header style={{ borderBottomColor: '#ddd' }}>
        <Left>
          <Button transparent onPress={_.throttle(this.props.back, 500)}>
            <Icon style={{ color: 'black' }} name="arrow-left" />
          </Button>
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
