import React, {Component} from 'react';
import {View, Alert, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Theme from '../../resources/Theme.js';
import {start, orders, deadman, notificationsPermissions, updateSubscriptions, loadNotifications} from '../../helpers/onstart.js';

import OrderBook from '../../modules/OrderBook/OrderBook.component.js';
import Summary from '../../modules/Summary/Summary.component.js';

export default class OrderBookScreen extends Component{
    componentDidMount(){
        
    }
	render(){
		return (
            <LinearGradient colors={[Theme['dark'].primary1, Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
				<ScrollView pagingEnabled={true} snapToInterval={100}>
						<Summary/>
						<OrderBook/>
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
