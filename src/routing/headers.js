import React from 'react';
import {Alert, View} from 'react-native';
import Theme from '../resources/Theme.js';
import IconButton from '../components/IconButton/IconButton.component.js';
import {help} from '../resources/Constants.js';

import config from '../config.js';

export default{
	Home:({ navigation }) => ({
		title: "Orderbook",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText,
        headerRight: <View style={styles.row}>
                              {
                                  config.testFlight&&
                                  <IconButton name="notification"
                                    size={20}
                                    color={Theme['dark'].primaryText}
                                    type={"entypo"}
                                    buttonStyle={styles.button}
                                    onPress={()=>navigation.navigate('Notifications')}/>
                              }
                              
                              <IconButton name="cog"
                                  size={20}
                                  color={Theme['dark'].primaryText}
                                  type={"entypo"}
                                  buttonStyle={styles.button}
                                  onPress={()=>navigation.navigate('Config')}/>
                    </View>
	}),
	PlaceOrder:({navigation}) => ({
		title: "Place Order",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <View style={styles.row}>
	    					<IconButton name="calculator" 
	    						 size={20} 
	    						 color={Theme['dark'].primaryText} 
	    						 type={"entypo"} 
	    						 buttonStyle={styles.button} 
	    						 onPress={()=>navigation.navigate('Calculator')}/>
	    			</View>
	}),
	Orders:({navigation}) => ({
		title: "My Orders",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Config:({navigation}) => ({
		title: "Config",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	UserLogs:({navigation}) => ({
		title: "User Logs",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	BitmexConfig:({navigation}) => ({
		title: "Bitmex Config",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	UISettings:({navigation}) => ({
		title: "UI Settings",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	TradesSettings:({navigation}) => ({
		title: "Trades Notifications",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <IconButton name="help-circle" 
	    						 size={20} 
	    						 color={Theme['dark'].primaryText} 
	    						 type={"feather"} 
	    						 buttonStyle={styles.button} 
	    						 onPress={()=>Alert.alert("Help", help.TRADES_NOTIF)}/>
	}),
	DeadManSettings:({navigation}) => ({
		title: "Dead-Man Settings",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <IconButton name="help-circle" 
	    						 size={20} 
	    						 color={Theme['dark'].primaryText} 
	    						 type={"feather"} 
	    						 buttonStyle={styles.button} 
	    						 onPress={()=>Alert.alert("Help", help.DEAD_MAN_HELP)}/>
	}),
	Stats:({navigation}) => ({
		title: "Trades",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Account:({navigation}) => ({
		title: "Account",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Transfer:({navigation}) => ({
		title: "Withdraw",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Calculator:({navigation}) => ({
		title: "Calculator",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Notifications:({navigation}) => ({
		title: "Notifications",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	OrderBook:({navigation}) => ({
		title: "Order Book",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
}


const styles={
	button:{
		marginHorizontal:10
	},
    row:{
        marginRight:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    }
}
