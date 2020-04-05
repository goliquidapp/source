import React, {Component} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';
import {
	start, orders, deadman,
	notificationsPermissions, 
	updateSubscriptions, 
	loadNotifications,
	rateApp
} from '../../helpers/onstart.js';

import OrderBook from '../../modules/OrderBook/OrderBook.component.js';
import Summary from '../../modules/Summary/Summary.component.js';
import Balance from '../../modules/Balance/Balance.component.js';
import Position from '../../modules/Position/Position.component.js';
import ScheduledPopup from '../../modules/ScheduledPopup/ScheduledPopup.component.js';
import CurrencySelect from '../../modules/CurrencySelect/CurrencySelect.component.js';

export default class Home extends Component{
	state={focused:false}
    componentDidMount(){
        start([orders, deadman, notificationsPermissions, updateSubscriptions, loadNotifications, rateApp]);
        this.listenerBlur=this.props.navigation.addListener('didBlur',()=>this.setState({focused:false}))
        this.listenerFocus=this.props.navigation.addListener('didFocus',()=>this.setState({focused:true}))
    }
    componentWillUnmount(){
    	this.listenerBlur.remove();
    	this.listenerFocus.remove();
    }
	newOrder=()=>{
		this.props.navigation.navigate('PlaceOrder')
	}
	render(){
		const {focused}=this.state;
		return (
            <LinearGradient colors={[Theme['dark'].primary1, Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
				<ScrollView>
					<CurrencySelect/>
					<Summary onBuy={this.newOrder} onSell={this.newOrder}/>
					<Balance/>
					<Position/> 
					{focused&&<OrderBook/>}
				</ScrollView>
				<ScheduledPopup/>
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
