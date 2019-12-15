import React from 'react';
import {View} from 'react-native';
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import config from '../config.js';

import headers from './headers.js'
import tabs from './tabs.js';

import Home from '../screens/Home/Home.component.js';
import PlaceOrder from '../screens/PlaceOrder/PlaceOrder.component.js';
import Orders from '../screens/Orders/Orders.component.js';
import Config from '../screens/Config/Config.component.js';
import UserLogs from '../screens/UserLogs/UserLogs.component.js';
import Stats from '../screens/Stats/Stats.component.js';
import BitmexConfig from '../screens/BitmexConfig/BitmexConfig.component.js';
import UISettings from '../screens/UISettings/UISettings.component.js';
import TradesSettings from '../screens/TradesSettings/TradesSettings.component.js';
import DeadManSettings from '../screens/DeadManSettings/DeadManSettings.component.js';
import Account from '../screens/Account/Account.component.js';
import Transfer from '../screens/Transfer/Transfer.component.js';
import Auth from '../screens/Auth/Auth.component.js';
import ProfitLoss from '../screens/Calculator/ProfitLoss.component.js';
import TargetPrice from '../screens/Calculator/TargetPrice.component.js';
import LiquidationPrice from '../screens/Calculator/LiquidationPrice.component.js';
import CurrentPrice from '../modules/CurrentPrice/CurrentPrice.component.js';
import Notifications from '../screens/Notifications/Notifications.component.js';
import OrderBook from '../screens/OrderBook/OrderBook.component.js';

//---------------------------------------------------------

const OrderTabsNavigator=createMaterialTopTabNavigator({
	NewOrders: 		{ screen: (props)=><Orders {...props} type={"Active"} filter={[{"ordStatus":"New", ordType:"Limit"}]}/>, navigationOptions: tabs.NewOrders },
	StopOrders: 	{ screen: (props)=><Orders {...props} type={"Stop"}   filter={[{"ordType":"Stop", "ordStatus":"New"},{"ordType":"StopLimit", "ordStatus":"New"},{"ordType":"LimitIfTouched", "ordStatus":"New"}, {"ordType":"MarketIfTouched", "ordStatus":"New"}]}/>, navigationOptions: tabs.StopOrders },
	FilledOrders: 	{ screen: (props)=><Orders {...props} type={"Filled"} filter={[{"ordStatus":"Filled"}]}/>, navigationOptions: tabs.FilledOrders },
	CancelledOrders:{ screen: (props)=><Orders {...props} type={"Cancel"} filter={[{"ordStatus":"Canceled"}]}/>, navigationOptions: tabs.CanceledOrders },
	AllOrders:		{ screen: (props)=><Orders {...props} type={"All"} />, navigationOptions: tabs.AllOrders }
}, tabs.Top)

//---------------------------------------------------------

const CalculatorTabsNavigator=createMaterialTopTabNavigator({
	ProfitLoss: 		{ screen: ProfitLoss, navigationOptions: tabs.ProfitLoss },
	TargetPrice: 		{ screen: TargetPrice, navigationOptions: tabs.TargetPrice },
	LiquidationPrice: 	{ screen: LiquidationPrice, navigationOptions: tabs.LiquidationPrice }
}, tabs.Top)

//---------------------------------------------------------

class CustomNavigator extends React.Component {
	static router = OrderTabsNavigator.router;
	render() {
    	const { navigation } = this.props;

    	return (
    		<View style={{width:'100%',height:'100%'}}>
    			<CurrentPrice/>
    			<OrderTabsNavigator navigation={navigation} />
    		</View>
    	)
	}
}

const OrdersNavigator=createStackNavigator({
	Orders: 	{ screen: CustomNavigator, navigationOptions: headers.Orders }
})

//---------------------------------------------------------

const HomeNavigator=createStackNavigator({
	Home: 								{ screen: Home, navigationOptions: headers.Home },
	Orders: 							{ screen: Orders, navigationOptions: headers.Orders },
	UserLogs:							{ screen: UserLogs, navigationOptions: headers.UserLogs },
	Config:								{ screen: Config, navigationOptions: headers.Config},
	BitmexConfig:						{ screen: BitmexConfig, navigationOptions: headers.BitmexConfig},
	UISettings:							{ screen: UISettings, navigationOptions: headers.UISettings},
	TradesNotificationsSettings:		{ screen: TradesSettings, navigationOptions: headers.TradesSettings},
	DeadManSettings:					{ screen: DeadManSettings, navigationOptions: headers.DeadManSettings},
    Notifications:                      { screen: Notifications, navigationOptions: headers.Notifications}
})

//---------------------------------------------------------s

const NewOrder=createStackNavigator({
	PlaceOrder: 	{ screen: PlaceOrder, navigationOptions: headers.PlaceOrder },
	Calculator:		{ screen: CalculatorTabsNavigator, navigationOptions:headers.Calculator}
})

//---------------------------------------------------------

const StatsNavigator=createStackNavigator({
	Stats: 			{ screen: Stats, navigationOptions: headers.Stats }
})

//---------------------------------------------------------

const AccountNavigator=createStackNavigator({
	Account: 		{ screen: Account, navigationOptions: headers.Account },
	Transfer:		{ screen: Transfer, navigationOptions: headers.Transfer }
})


const SettingsNavigator=createStackNavigator({
     Config:            { screen: Config, navigationOptions: headers.Config}
})

const NotificationsNavigator=createStackNavigator({
     Notifications:    { screen: Notifications, navigationOptions: headers.Notifications}
})

//---------------------------------------------------------

var TabNavigator;

if (config.testFlight){
    TabNavigator = createBottomTabNavigator({
      Home:             { screen: HomeNavigator, navigationOptions: tabs.Home },
      Orders:           { screen: OrdersNavigator, navigationOptions: tabs.Orders },
      NewOrder:         { screen: NewOrder,    navigationOptions: tabs.HeroButton},
      Stats:            { screen: StatsNavigator, navigationOptions: tabs.Stats },
      Account:          { screen: AccountNavigator, navigationOptions: tabs.Account }
    }, tabs.Bottom);
}else{
    TabNavigator = createBottomTabNavigator({
      Home:             { screen: HomeNavigator, navigationOptions: tabs.Home },
      Orders:           { screen: OrdersNavigator, navigationOptions: tabs.Orders },
      NewOrder:         { screen: NewOrder,    navigationOptions: tabs.HeroButton},
      Stats:            { screen: StatsNavigator, navigationOptions: tabs.Stats },
      Notifications:    { screen: NotificationsNavigator, navigationOptions: tabs.Notifications }
    }, tabs.Bottom);
}



const OrderbookNavigator=createStackNavigator({
	OrderBook: 		  { screen: OrderBook, navigationOptions: headers.OrderBook }
})

const CalculatorNavigator=createStackNavigator({
	Calculator: 	  { screen: CalculatorTabsNavigator, navigationOptions: headers.Calculator }
})

const LiteApp = createBottomTabNavigator({
	Calculator:		  { screen: CalculatorNavigator, navigationOptions: tabs.Calculator}
}, tabs.Bottom)

//---------------------------------------------------------

var switchNav;

if (config.liteApp){
    switchNav=createSwitchNavigator({
        LiteApp:         LiteApp
    }, {
        initialRouteName : 'LiteApp'
    })
}
else{
    switchNav=createSwitchNavigator({
        App: 		TabNavigator,
        Auth: 		Auth
    }, {
        initialRouteName : 'Auth'
    })
}

const Navigation = createAppContainer(switchNav);

export default Navigation
