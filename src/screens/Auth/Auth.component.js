import React, {Component} from 'react';
import {ScrollView, View, ActivityIndicator, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import Theme from '../../resources/Theme.js';

import Login from '../../modules/Login/Login.component.js';

import {storeAppAuth} from '../../helpers/bitmex.helpers.js';

export default class BitmexConfig extends Component{
	onClose=()=>{
		this.props.navigation.navigate('Home')
	}
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<Login onClose={this.onClose}/>
				</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	}
}