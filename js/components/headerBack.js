import React, { Component } from 'react';
import { Header, Left, Button, Icon, Title } from 'native-base';
import _ from 'lodash';

export default class HeaderBack extends Component {

	render() {
		return (
			<Header style={{ backgroundColor: 'white' }} androidStatusBarColor="black">
				<Left style={{ flexDirection: 'row' }}>
					<Button transparent onPress={_.throttle(this.props.back, 500)}>
						<Icon style={{ color: 'black' }} name="arrow-left" />
					</Button>
					<Title style={{ color: 'black', alignSelf: 'center' }}>{this.props.title}</Title>
				</Left>
			</Header>
		);
	}
}