import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

class Button extends Component{
	render(){
		const {onPress, buttonStyle, textStyle, text, children, colors}=this.props;
		if (colors){
			return (
				<LinearGradient colors={colors} style={[styles.button,buttonStyle, styles.gradient]}>
					<TouchableOpacity onPress={onPress} style={styles.touchContainer}>
						<Text style={[styles.text,textStyle]}>{text}</Text>
					</TouchableOpacity>
				</LinearGradient>
			)
		}
		else{
			return (
				<TouchableOpacity onPress={onPress} style={[styles.button,buttonStyle]}>
					<Text style={[styles.text,textStyle]}>{text}</Text>
					{children}
				</TouchableOpacity>
			)
		}
	}
}

const styles={
	button:{
		flexDirection:'row',
		backgroundColor:Theme['dark'].highlighted,
		paddingVertical:10,
		paddingHorizontal:30,
		elevation:5,
		alignItems:'center',
		justifyContent:'center',
		borderRadius:8
	},
	text:{
		color:Theme['dark'].primaryText,
		fontSize:20,
		fontFamily:Theme['dark'].fontNormal
	},
	gradient:{
		elevation:6,
		borderRadius:8
	},
	touchContainer:{
		width:'100%',
		justifyContent:'center',
		alignItems:'center'
	}
}

export default Button;
