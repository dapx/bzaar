import React, { Component } from 'react';
import { Container, Header, Content, Title, Left, Icon, Text, Button } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as NavActions from '../actions/navigation';

class Bag extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pendingRequest: false,
      errorMessage: '',
      showToast: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      pendingRequest: nextProps.pendingRequest,
      errorMessage: nextProps.errorMessage,
      showToast: nextProps.showToast,
    });
  }

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: 'white' }} androidStatusBarColor="black">
          <Left style={{ flexDirection: 'row' }}>
            <Button transparent onPress={() => this.props.navActions.back()}>
              <Icon style={{ color: 'black' }} name="arrow-left" />
            </Button>
            <Title style={{ color: 'black', alignSelf: 'center' }}>Sacola de Compras</Title>
          </Left>
        </Header>
        <Content style={{ backgroundColor: 'white' }} padder>
          <Text>Nenhum item na sacola</Text>
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    pendingRequest: state.register.pendingRequest,
    errorMessage: state.login.errorMessage,
    showToast: state.login.showToast,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
  };
}

Bag.propTypes = {
  pendingRequest: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
  showToast: PropTypes.bool.isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Bag);
