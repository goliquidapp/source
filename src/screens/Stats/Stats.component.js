import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';

import Trades from '../../modules/Trades/Trades.component.js';

export default class Orders extends Component{
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1, Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<ScrollView>
						<Trades containerStyle={styles.trades}/>
					</ScrollView>
				</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	},
	trades:{
		width:'100%',
		height:'100%'
	}
}
