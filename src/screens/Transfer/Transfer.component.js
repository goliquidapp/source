import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import Theme from '../../resources/Theme.js';

import Withdraw from '../../modules/Withdraw/Withdraw.component.js';
import Balance from '../../modules/Balance/Balance.component.js';

export default class Account extends Component{
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<ScrollView>
						<Balance/>
						<Withdraw/>
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