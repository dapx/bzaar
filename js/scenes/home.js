import React, { Component } from 'react';
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { StyleProvider, Container, Header, Body, Content, Thumbnail, Title, Tabs, Tab, Form, Item, Label, Icon, Input, Text, Button, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/stores';
import theme from '../../native-base-theme/variables/commonColor';
import getTheme from '../../native-base-theme/components';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
        name: this.props.user.name,
        id: this.props.user.id,
        email: this.props.user.email,
        jwt: this.props.jwt,
        list: this.props.stores.list || [],
        loadingRequest: !!this.props.stores.loadingRequest,
    }
  }

  componentWillMount(){
    this.props.list(this.props.jwt);
  }

  componentWillReceiveProps(nextProps){
    this.setState({name: nextProps.user.name, id: nextProps.user.id, email: nextProps.user.email, jwt: nextProps.jwt, loadingRequest: nextProps.stores.loadingRequest, list: nextProps.stores.list});
  }

  renderItem({item, index}) {
    return (
      <View key={index} style={{margin: 5, flexWrap: 'wrap', width: 150, justifyContent: 'center', alignItems: 'center'}}>
        <Image source={{uri: item.logo, width: 60, height: 60}} />
        <Text style={{textAlign: 'center'}}>{item.name}</Text>
        <Text style={{textAlign: 'center'}}>{item.description}</Text>
      </View>
    );
  }

  render() {
    return (
      <StyleProvider style={getTheme(theme)}>
      <Container>
        <Header hasTabs style={{ backgroundColor: 'white', flexDirection: 'column' }} androidStatusBarColor='black'>
          <Image style={{alignSelf: 'center', width: 30, height: 30, resizeMode: 'stretch'}} source={require('../../images/header_logo.png')} />
        </Header>
          <Tabs>
            <Tab heading="Stores">
            { !!this.state.loadingRequest 
              ? <Spinner />
              : <FlatList
                  columnWrapperStyle={{justifyContent: 'space-around', margin: 10, backgroundColor: 'white'}}
                  numColumns={2}
                  horizontal={false}
                  data={this.state.list}
                  renderItem={this.renderItem}
                  keyExtractor={item => item.id} />
            }
            </Tab>
            <Tab heading="Sacola">
              <Text>Empty</Text>
            </Tab>
            <Tab heading="My Stores">
              <Text>Empty</Text>
            </Tab>
          </Tabs>
      </Container>
      </StyleProvider>
    )
  }
}

function mapStateToProps(state) {
  return { 
    user: state.login.user,
    jwt: state.login.jwt,
    stores: state.stores,
   };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

const styles = StyleSheet.create({
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Home);
