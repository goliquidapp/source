import React, {Component} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import {Icon} from 'react-native-elements'
import Colors from '../../resources/Colors.js'

class IconButton extends Component{
	render(){
		const {name,type,size,color,onPress,buttonStyle, labelStyle, reverse, raised, label}=this.props
		return (
			<TouchableOpacity onPress={onPress} style={[styles.button,buttonStyle]}>
				<Icon name={name} size={size} color={color} type={type} reverse={reverse} raised={raised}/>
				{label&&<Text style={[styles.label,labelStyle]}>{label}</Text>}
			</TouchableOpacity>
		)
	}
}

const styles={
	button:{
		marginHorizontal:10,
		flexDirection:'column'
	},
	label:{
		color: Colors['White'],
		fontSize: 12
	}
}

export default IconButton;