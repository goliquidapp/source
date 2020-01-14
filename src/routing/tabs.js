import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';
import Theme from '../resources/Theme.js';
import {Icon} from 'react-native-elements';
import HeroButton from '../modules/HeroButton/HeroButton.component.js';

export default{
	Bottom:{
		backBehavior: 'order',
		labeled: true,
		shifting: true,
		barStyle:{
			backgroundColor: Theme['dark'].primary3,
			borderTopLeftRadius:20,
			borderTopRightRadius:20,
			borderTopWidth:1,
			borderTopColor:Theme['dark'].primary1
		}
	},
	Top:{
		tabBarOptions:{
			tabStyle:{
				width:140
			},
			scrollEnabled: true,
			style:{
				backgroundColor: Theme['dark'].primary1
			},
			indicatorStyle:{
				backgroundColor: Theme['dark'].highlighted
			},
			labelStyle:{
				fontSize: 14,
				fontFamily:Theme['dark'].fontNormal
			}
		}
	},
	NewOrders:{
		title:'Active'
	},
	FilledOrders:{
		title:'Filled'
	},
	StopOrders:{
		title:'Stop'
	},
	MarketOrders:{
		title:'Market'
	},
	CanceledOrders:{
		title:'Canceled'
	},
	AllOrders:{
		title:'All'
	},
	ProfitLoss:{
		title:'Profit Loss'
	},
	TargetPrice:{
		title:'Target Price'
	},
	LiquidationPrice:{
		title:'Liquidation Price'
	},
	Home:({ navigation }) => ({
		tabBarLabel: "Orderbook",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
	    tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="book" size={15} color={Theme['dark'].highlighted} type={"ant-design"}/>
	    	else 
	    		return <Icon name="book" size={15} color={Theme['dark'].secondaryText} type={"ant-design"}/>
	    }
	}),
	Orders:({ navigation }) => ({
		tabBarLabel: "My Orders",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="list" size={15} color={Theme['dark'].highlighted} type={"entypo"}/>
	    	else 
	    		return <Icon name="list" size={15} color={Theme['dark'].secondaryText} type={"entypo"}/>
	    }
	}),
	HeroButton:({navigation})=>({
		tabBarLabel: " ",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8,
			    fontFamily:Theme['dark'].fontNormal
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
    		return (
    			<HeroButton/>
    		)
	    }
	}),
	Stats:({ navigation }) => ({
		tabBarLabel: "Stats",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="bar-chart" size={15} color={Theme['dark'].highlighted} type={"font-awesome"}/>
	    	else 
	    		return <Icon name="bar-chart" size={15} color={Theme['dark'].secondaryText} type={"font-awesome"}/>
	    }
	}),
	Account:({ navigation }) => ({
		tabBarLabel: "Account",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="account" size={15} color={Theme['dark'].highlighted} type={"material-community"}/>
	    	else 
	    		return <Icon name="account" size={15} color={Theme['dark'].secondaryText} type={"material-community"}/>
	    }
	}),
	Settings:({ navigation }) => ({
		tabBarLabel: "Settings",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="cog" size={15} color={Theme['dark'].highlighted} type={"entypo"}/>
	    	else 
	    		return <Icon name="cog" size={15} color={Theme['dark'].secondaryText} type={"entypo"}/>
	    }
	}),
	Notifications:({ navigation }) => ({
		tabBarLabel: "Notifications",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="notification" size={15} color={Theme['dark'].highlighted} type={"entypo"}/>
	    	else 
	    		return <Icon name="notification" size={15} color={Theme['dark'].secondaryText} type={"entypo"}/>
	    }
	}),
	Calculator:({ navigation }) => ({
		tabBarLabel: "Calculators",
		tabBarOptions: {
			activeTintColor : Theme['dark'].highlighted,
			style:{
				backgroundColor: Theme['dark'].primary3,
				borderTopLeftRadius:20,
				borderTopRightRadius:20,
				borderTopWidth:1,
				borderTopColor:Theme['dark'].primary1,
				paddingBottom:10,
				paddingTop:10
			},
			labelStyle: {
			    fontSize: 8
			}
		},
		tabBarButtonComponent:TouchableOpacity,
		tabBarIcon: ({ focused, horizontal, tintColor })=>{
	    	if (focused)
	    		return <Icon name="calculator" size={15} color={Theme['dark'].highlighted} type={"entypo"}/>
	    	else 
	    		return <Icon name="calculator" size={15} color={Theme['dark'].secondaryText} type={"entypo"}/>
	    }
	})
}


