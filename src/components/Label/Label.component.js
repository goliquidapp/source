import React, {Component} from 'react';
import { View, Text } from 'react-native';
import Colors from '../../resources/Colors.js';

import {Icon} from 'react-native-elements'

class Label extends Component{
	render(){
		const {containerStyle, textStyle, titleStyle, icon, type}=this.props
		return (
			<View style={[styles.container,containerStyle]}>
				<Icon name={icon} type={type} size={18}/>
				<Text style={[styles.title,titleStyle]}>{this.props.title}</Text>
				<Text style={[styles.text,textStyle]}>{this.props.text}</Text>
			</View>
		)
	}
}

const styles={
	container:{
		flex:1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		alignSelf:'center',
		width:'90%',
		marginVertical:5
	},
	text:{
		color:Colors['Black Pearl'],
		fontWeight:'bold',
		fontSize:16,
		width:'60%'
	},
	title:{
		color:Colors['Black Pearl'],
		fontSize:16,
		width:'20%',
		marginLeft:10
	}
}

export default Label;