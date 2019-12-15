import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

import NewOrder from '../../modules/NewOrder/NewOrder.component.js';
import Position from '../../modules/Position/Position.component.js';

export default class PlaceOrder extends Component{
	myOrders=()=>{
		this.props.navigation.navigate('Orders')
	}
	render(){
		return (
			<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
				<ScrollView>
					<NewOrder/>
				</ScrollView>
			</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	}
}