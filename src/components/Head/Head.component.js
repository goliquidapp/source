import React, {Component} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '../../resources/Colors.js';
import Theme from '../../resources/Theme.js'

import * as Animatable from 'react-native-animatable';

const defaultHeadSize=70;

class Head extends Component{
	state={
		style:{
			width:this.props.size,
			height:this.props.size,
			borderRadius:this.props.size/2
		}
	}
	componentDidUpdate(prevProps){
		if (this.props.size!==prevProps.size){
			this.setState({
				style:{
					width:this.props.size,
					height:this.props.size,
					borderRadius:this.props.size/2
				}
			})
		}
	}
	renderImages=()=>{
		var {images}=this.props
		var {style}=this.state
		if (images.length>0){
			return (
				<Image source={{uri:images[0]}} style={style}/>
			)
		}
		else return <View></View>
	}
	renderAvatar=()=>{
		var {images,avatar}=this.props
		var {style}=this.state
		if (images.length===0) return <Image source={{uri:avatar}} style={style}/>
		else return <View></View>
	}
	renderOverlay=()=>{
		var {images,overlayStyle}=this.props;
		var {style}=this.state
		var border=images.length>0?4:0;
		return <View style={[styles.overlay,style,overlayStyle,{borderWidth:border}]}></View>
	}
	render(){
		var {title,containerStyle,titleStyle}=this.props
		var {style}=this.state
		return (
			<Animatable.View style={[styles.container,{width:style.width},containerStyle]} animation={"fadeIn"} useNativeDriver duration={Theme.Transition}>
				<TouchableOpacity onPress={this.props.onPress}>
					{this.renderAvatar()}
					{this.renderImages()}
					{this.renderOverlay()}
				</TouchableOpacity>
				<Text numberOfLines={1} style={[styles.title,titleStyle]}>{title}</Text>
			</Animatable.View>
		)
	}
}

Head.defaultProps={
	size:defaultHeadSize
}

const styles={
	container:{
		height:'100%',
		position:'relative',
		alignItems:'center',
		marginHorizontal:10
	},
	image:{
		
	},
	overlay:{
		position:'absolute',
		top:0,
		left:0,
		backgroundColor:'rgba(128, 128, 128, 0.4)',
		borderStyle:'solid',
		borderColor:Colors['Sunset Orange']
	},
	title:{
		textAlign:'center',
		width:'100%'
	}
}

export default Head;