import React, {Component} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

import NotificationsModule from '../../modules/Notifications/Notifications.component.js';

export default class Notifications extends Component{
	render(){
		return (
				<View style={styles.container}>
					<NotificationsModule/>
				</View>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%',
		backgroundColor:Theme['dark'].primary1
	}
}