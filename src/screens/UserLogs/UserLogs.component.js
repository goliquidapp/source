import React, {Component} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

import UserLog from '../../modules/UserLog/UserLog.component.js';

export default class UserLogs extends Component{
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1, Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<UserLog containerStyle={styles.userLogs}/>
				</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	},
	userLogs:{
		width:'100%',
		height:'100%'
	}
}