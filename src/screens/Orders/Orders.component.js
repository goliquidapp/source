import React, {Component} from 'react';
import {View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

import MyOrders from '../../modules/MyOrders/MyOrders.component.js';

export default class Orders extends Component{
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<MyOrders containerStyle={styles.myOrders} filter={this.props.filter} type={this.props.type}/>
				</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	},
	myOrders:{
		width:'100%',
		height:'100%'
	}
}