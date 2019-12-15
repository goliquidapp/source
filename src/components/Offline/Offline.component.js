import React, {Component} from 'react';
import {Modal, View, Text} from 'react-native';

import Colors from '../../resources/Colors.js';

class Offline extends Component{
	render(){
		const {visible}=this.props
		return (
			<Modal transparent = {true} visible={visible} onRequestClose={()=>{}}>
				<View style={styles.container}>
					<View style={styles.messageContainer}>
						<Text style={styles.message}>You're currently offline</Text>
					</View>
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
		backgroundColor:'rgba(0,0,0,0.4)',
		top:0,
		left:0
	},
	messageContainer:{
		backgroundColor:Colors['White'],
		padding:20,
		borderRadius:20
	},
	message:{
		textAlign:'center'
	}
}

export default Offline