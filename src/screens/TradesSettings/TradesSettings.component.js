import React, {Component} from 'react';
import {ScrollView, View, ActivityIndicator, Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import Theme from '../../resources/Theme.js';

import TradesSettingsModule from '../../modules/Settings/TradesNotifications.component.js';

import {storeAppAuth} from '../../helpers/bitmex.helpers.js';

export default class TradesSettings extends Component{
	onClose=()=>{
		this.props.navigation.navigate('Home')
	}
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<TradesSettingsModule onClose={this.onClose}/>
				</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	},
	userLog:{
		marginTop:20
	},
	button:{
		borderRadius:0,
		paddingVertical:20,
		borderColor:Theme['dark'].disabled,
		borderBottomWidth:1,
		backgroundColor:Theme['dark'].primary2
	},
	buttonTextStyle:{
		width:'100%',
		textAlign:'left',
		fontSize:14
	}
}