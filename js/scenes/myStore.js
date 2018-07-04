import React, { Component } from 'react';
import { StyleSheet, View, Text, SectionList, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container, Icon, Content } from 'native-base';
import PropTypes from 'prop-types';
import HeaderBack from '../components/headerBack';
import * as NavActions from '../actions/navigation';
import * as StoresActions from '../actions/myStores';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    flex: 1,
    margin: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
  },
  buttonIcon: {
    marginRight: 10,
    marginLeft: 10,
  },
  section: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: 15,
  },
});

class MyStore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      store: props.store,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      store: nextProps.store,
    });
  }

  editStore = () => this.props.storesActions.editStore(this.state.store);
  openProducts = () => this.props.storesActions.openProducts(this.state.store.id);
  openOrders = () => this.props.navActions.orders();

  sections = [{
    title: 'Configuração',
    data: [{ icon: 'edit', name: 'Edit', onPress: this.editStore }],
  },
  {
    title: 'Gerenciamento',
    data: [{
      icon: 'tag',
      name: 'Produtos',
      onPress: this.openProducts,
    },
    {
      icon: 'package',
      name: 'Pedidos',
      onPress: this.openOrders,
    }],
  }];

  render() {
    return (
      <Container style={styles.container}>
        <HeaderBack title={this.state.store.name} back={() => this.props.navActions.back()} />
        <Content style={{ flex: 1 }}>
        <SectionList
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={item.onPress}>
              <View style={styles.button}>
                <Icon
                  style={styles.buttonIcon}
                  name={item.icon}
                />
                <Text key={index}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.section}>
              {title}
            </Text>
          )}
          sections={this.sections}
          keyExtractor={(item, index) => item + index}
        />
        </Content>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return {
    jwt: state.login.jwt,
    store: state.myStores.store,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions: bindActionCreators(NavActions, dispatch),
    storesActions: bindActionCreators(StoresActions, dispatch),
  };
}

MyStore.propTypes = {
  jwt: PropTypes.string.isRequired,
  store: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
  }).isRequired,
  navActions: PropTypes.shape({
    back: PropTypes.func.isRequired,
    bag: PropTypes.func.isRequired,
    orders: PropTypes.func.isRequired,
  }).isRequired,
  storesActions: PropTypes.shape({
    editStore: PropTypes.func.isRequired,
    openProducts: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyStore);
