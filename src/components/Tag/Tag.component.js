import React, {Component} from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import Theme from '../../resources/Theme.js';
import LinearGradient from 'react-native-linear-gradient';

import * as Animatable from 'react-native-animatable';

import {Icon} from 'react-native-elements'

class Tag extends Component{
	render(){
		const {containerStyle, labelStyle, subtitleStyle, label, color, colors, subtitle, subtitle2, line, align, onPress, disabled}=this.props;
		// check color then colors
		var bgColor=color?[color,color]:(colors.length>1?colors:[colors[0],colors[0]]);

		return (
			<TouchableOpacity activeOpacity={disabled?1:0.2} style={[styles.container,containerStyle]} onPress={disabled?undefined:onPress}>
				{
					(align==='left')&&
					<LinearGradient colors={bgColor} style={[styles.column,styles.tag]} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
						{disabled&&<View style={styles.overlay}></View>}
						<Text style={[styles.label,labelStyle]}>{label}</Text>
						{line&&<Animatable.View animation={"fadeIn"} useNativeDriver duration={600} style={styles.line}></Animatable.View>}
					</LinearGradient>
				}
				<View style={styles.column}>
					<Text style={[styles.subtitle,subtitleStyle,{textAlign:align}]}>{subtitle}</Text>
					<Text style={[styles.subtitle2,subtitleStyle,{textAlign:align}]}>{subtitle2}</Text>
				</View>
				{
					(align==='right')&&
					<LinearGradient colors={bgColor} style={[styles.column,styles.tag]} start={{x: 0, y: 0}} end={{x: 1, y: 1}}>
						{disabled&&<View style={styles.overlay}></View>}
						<Text style={[styles.label,labelStyle]}>{label}</Text>
						{line&&<Animatable.View animation={"fadeIn"} useNativeDriver duration={600} style={styles.line}></Animatable.View>}
					</LinearGradient>
				}
			</TouchableOpacity>
		)
	}
}

Tag.defaultProps={
	align:'left'
}

const styles={
	container:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'50%'
	},
	tag:{
		width:50,
		height:50,
		marginVertical:10,
		borderRadius:8
	},
	label:{
		color:Theme['dark'].primaryText,
		fontSize:16,
		textAlign:'center',
		fontFamily:Theme['dark'].fontNormal
	},
	subtitle:{
		width:'100%',
		marginTop:5,
		color:Theme['dark'].primaryText,
		fontSize:15,
		textAlign:'left',
		fontFamily:Theme['dark'].fontNormal
	},
	subtitle2:{
		width:'100%',
		marginTop:5,
		color:Theme['dark'].secondaryText,
		fontSize:16,
		textAlign:'left',
		fontFamily:Theme['dark'].fontBold
	},
	line:{
		width:'100%',
		borderBottomColor:'white',
		borderBottomWidth:4,
		marginTop:5,
		borderRadius:4
	},
	touch:{
		zIndex:1
	},
	column:{
		width:'50%',
		height:50,
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center'
	},
	overlay:{
		width:'100%',
		height:'100%',
		opacity:0.5,
		backgroundColor:Theme['dark'].disabled,
		position:'absolute',
		zIndex:2,
		borderRadius:8
	}
}

export default Tag;