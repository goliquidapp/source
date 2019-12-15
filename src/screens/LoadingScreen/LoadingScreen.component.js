import React, {Component} from 'react';
import {View, Image, ActivityIndicator, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

import Logo from '../../resources/icons/logo.js';

export default class LoadingScreen extends Component{
	render(){
		return (
            <View style={styles.container}>
            	<Logo width={'30%'} height={'30%'}/>
            	<Text style={styles.text}>loading...</Text>
            	<ActivityIndicator/>
            </View>
			)
	}
}

const styles={
	container:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center',
		width:'100%',
        height:'100%',
    backgroundColor:Theme['dark'].primary1
	},
	logo:{
		width:100,
		height:100
	},
	text:{
		color:Theme['dark'].primaryText,
		margin:20
	}
}
