import React, {Component} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';

import {Icon} from 'react-native-elements'

import Colors from '../../resources/Colors.js';

class Options extends Component{
	render(){
		const {options}=this.props
		return (
			<View style={styles.container}>
				{
					options.map((option,index)=>
						<TouchableOpacity key={index.toString()} onPress={option.onPress} style={styles.option}>
							<Text style={styles.text}>{option.title}</Text>
							<Icon name={option.icon.name} type={option.icon.type}/>
						</TouchableOpacity>
					)
				}
			</View>
		)
	}
}

const styles={
	container:{
		flexDirection:'column',
		width:'80%',
		backgroundColor:Colors['White'],
		alignSelf:'center'
	},
	option:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		height:50,
		paddingHorizontal:20
	},
	text:{
		color:Colors['Black'],
		fontSize:18
	}
}

export default Options