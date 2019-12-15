import React, {Component} from 'react';
import {View} from 'react-native';
import Modal from "react-native-modal";

class Overlay extends Component{
	render(){
		const {visible}=this.props;
		if (visible)
			return (
				<View style={[styles.container,this.props.style]}>
					{this.props.children}
				</View>
			)
		else
			return <View></View>
	}
}

const styles={
	container:{
		justifyContent:'center',
		width:'100%',
		height:'100%',
		position:'absolute',
		backgroundColor:'rgba(0,0,0,0.5)',
		top:0,
		left:0,
		zIndex:100
	}
}

export default Overlay