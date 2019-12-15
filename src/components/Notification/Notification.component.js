import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import {Icon} from 'react-native-elements'

import Colors from '../../resources/Colors.js';
import Theme from '../../resources/Theme.js';
import TextTicker from 'react-native-text-ticker'

class Notification extends Component{
	render(){
		const {type, image, title, body}=this.props;
		return(
				<View style={[styles.container,styles.theme[type]]}>
					<View style={styles.close}>
						<Icon name='close' size={20} color={styles.theme[type].color}/>
					</View>

					<View style={styles.imageContainer}>
						<Image style={styles.image} source={image}/>
					</View>

					<View style={styles.content}>
						<Text style={[styles.title,styles.theme[type]]}>
							{title}
						</Text>
						<Text style={[styles.body,styles.theme[type]]}>
							{body}
						</Text>
					</View>
				</View>
			)
	}
}

const styles={
	container:{
		backgroundColor:Colors['White'],
		width:'102%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		paddingVertical:15
	},
	theme:{
		warning:{
			backgroundColor:Colors['Drover'],
			color:Colors['Pesto'],
			fontFamily:Theme['dark'].fontNormal
		},
		danger:{
			backgroundColor:Colors['Beauty Bush'],
			color:Colors['Copper Rust'],
			fontFamily:Theme['dark'].fontNormal
		},
		info:{
			backgroundColor:Colors['Charlotte'],
			color:Colors['Ming'],
			fontFamily:Theme['dark'].fontNormal
		},
		success:{
			backgroundColor:Colors['Tea Green'],
			color:Colors['Hippie Green'],
			fontFamily:Theme['dark'].fontNormal
		}
	},
	imageContainer:{
		alignItems:'center',
		justifyContent:'center',
		padding:10,
		width:40,
		height:40,
		borderRadius:25,
		backgroundColor:Colors['Alabaster'],
		elevation:1
	},
	image:{
		padding:20,
		width:'100%',
		height:'100%',
		borderRadius:30
	},
	close:{
		position:'absolute',
		top:5,
		right:5,
		opacity:0.2,
		elevation:1
	},
	content:{
		width:'75%'
	},
	title:{
		fontSize:14,
		fontWeight:'bold',
		fontFamily:Theme['dark'].fontBold
	},
	body:{
		fontSize:12,
		color:Colors['Gray'],
		fontFamily:Theme['dark'].fontNormal
	}
}

export default Notification