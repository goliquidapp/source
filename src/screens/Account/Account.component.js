import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import Theme from '../../resources/Theme.js';

import Wallet from '../../modules/Wallet/Wallet.component.js';
import Balance from '../../modules/Balance/Balance.component.js';
import Deposit from '../../modules/Deposit/Deposit.component.js';
import Accounts from '../../modules/Accounts/Accounts.component.js';

import Button from '../../components/Button/Button.component.js';

export default class Account extends Component{
	withdraw=()=>{
		this.props.navigation.navigate('Transfer')
	}
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<ScrollView>
						<Accounts/>
						<Balance/>
						<Wallet/>
						<Deposit/>
						<Button text={"Withdraw"} buttonStyle={styles.buttonStyle} onPress={this.withdraw}/>
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
	buttonStyle:{
		marginVertical:40,
		width:'80%',
		alignSelf:'center'
	}
}