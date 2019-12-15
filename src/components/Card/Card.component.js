import React, {Component} from 'react';
import {View, Text, TouchableHighlight, Image, Dimensions} from 'react-native';

import Colors from '../../resources/Colors.js'

const screenWidth = Dimensions.get('window').width

/*
	props: 
		image <String>
		tag, hero, subtitle <String>
*/

export default class Card extends Component{
	constructor(props){
		super(props)
		this.state={width:'100%',height:'100%'}
		this.position=[20,'60%']
	}
	componentDidMount(){
		if (this.props.image){
			Image.getSize(this.props.image, (width, height) => {
	            const scaleFactor = width / screenWidth
	            const imageHeight = height / scaleFactor
	            this.setState({width:screenWidth,height:imageHeight})
	        });
		}
	}
	render(){
		const {hero, subtitle, image, tag,overlay}=this.props
		const {width, height}=this.state
		const positionStyle={left:this.position[0],top:this.position[1]}
		return (
				<TouchableHighlight onPress={this.props.onPress}>
					<View style={styles.container}>
						<Image style={{width,height}} source={{uri:image}}/>
						{overlay&&<View style={styles.overlay}></View>}
						<View style={[styles.labels,positionStyle]}>
							{tag&&<Text style={styles.tag}>{tag}</Text>}
							<Text style={styles.hero}>{hero}</Text>
							<Text style={styles.subtitle}>{subtitle}</Text>
						</View>
					</View>
				</TouchableHighlight>
			)
	}
}

Card.defaultProps={
	overlay:true
}

const styles={
	container:{
		position:'relative',
		backgroundColor:'rgba(0,0,0,0.9)',
		width:'100%',
		height:'100%'
	},
	labels:{
		position:'absolute'
	},
	hero:{
		color:Colors['White'],
		fontSize:18,
		fontWeight:'bold'
	},
	subtitle:{
		color:Colors['White'],
		fontSize:16
	},
	tag:{
		backgroundColor:Colors['White'],
		color:Colors['Black'],
		paddingVertical:2,
		paddingHorizontal:8,
		borderRadius:5,
		fontSize:16,
		fontWeight:'bold'
	},
	overlay:{
		position:'absolute',
		top:0,
		left:0,
		width:'100%',
		height:'100%',
		backgroundColor:'rgba(64, 64, 64, 0.4)'
	}
}