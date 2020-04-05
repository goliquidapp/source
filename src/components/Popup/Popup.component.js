import React, {Component} from 'react';
import {View} from 'react-native';
import Modal from "react-native-modal";

class Popup extends Component{
	render(){
		const {visible,onClose}=this.props
		return (
			<Modal  backdropOpacity={0.4}
					useNativeDriver transparent = {true} 
					isVisible={visible} 
					onBackdropPress={onClose} 
					onBackButtonPress={onClose}>
				<View style={[styles.container,this.props.style]}>
					{this.props.children}
				</View>
			</Modal>
		)
	}
}

const styles={
	container:{
		justifyContent:'center',
		width:'100%',
		height:'100%',
		position:'absolute',
		backgroundColor:'transparent',
		top:0,
		left:0
	}
}

export default Popup
