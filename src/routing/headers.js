import React from 'react';
import {Alert, View, Image, Text, TouchableOpacity} from 'react-native';
import Theme from '../resources/Theme.js';
import IconButton from '../components/IconButton/IconButton.component.js';
import {help} from '../resources/Constants.js';
import DonateButton from '../components/DonateButton/DonateButton.component.js';
import store from '../redux/store.js';

import config from '../config.js';

const NotificationIcon=({navigation})=>{
	var state=store.getState();
    const {settings}=state;
    const {publicationNotifications, highOrdersNotifications}=settings.notificationsSettings;

	const notification=(publicationNotifications&&highOrdersNotifications)?
							'notifications-active':
							(publicationNotifications||highOrdersNotifications)?
							'notifications':
							'notifications-off'
	return (
		<View>
			<IconButton name={notification}
			            size={20}
			            color={Theme['dark'].primaryText}
			            type={"material-icons"}
			            buttonStyle={styles.button}
			            onPress={()=>navigation.navigate('Notifications')}/>
		</View>
	)
}

export default{
	Home:({ navigation }) => ({
		title: "",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText,
        headerRight:<View style={styles.rowRight}>
                              {config.testFlight&&<NotificationIcon navigation={navigation}/>}
                              
                              <IconButton name="cog"
                                  size={20}
                                  color={Theme['dark'].primaryText}
                                  type={"entypo"}
                                  buttonStyle={styles.button}
                                  onPress={()=>navigation.navigate('Config')}/>
                    </View>,
        headerLeft: <View style={styles.rowLeft}>
			        	<Image style={styles.logo} source={require('../resources/icons/icon.png')}/>
			        	<Text style={styles.title}>Liquid</Text>
			        </View>
	}),
	PlaceOrder:({navigation}) => ({
		title: "Place Order",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <View style={styles.rowRight}>
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
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Config:({navigation}) => ({
		title: "Settings",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	UserLogs:({navigation}) => ({
		title: "User Logs",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	BitmexConfig:({navigation}) => ({
		title: "Bitmex Config",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	UISettings:({navigation}) => ({
		title: "UI Settings",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	TradesSettings:({navigation}) => ({
		title: "Trades Notifications",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <IconButton name="help-circle" 
	    						 size={20} 
	    						 color={Theme['dark'].primaryText} 
	    						 type={"feather"} 
	    						 buttonStyle={styles.button} 
	    						 onPress={()=>Alert.alert("Help", help.TRADES_NOTIF)}/>
	}),
	PublicationsSettings:({navigation}) => ({
		title: "Publications Notifications",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <IconButton name="help-circle" 
	    						 size={20} 
	    						 color={Theme['dark'].primaryText} 
	    						 type={"feather"} 
	    						 buttonStyle={styles.button} 
	    						 onPress={()=>Alert.alert("Help", help.PUBS_NOTIF)}/>
	}),
	DeadManSettings:({navigation}) => ({
		title: "Dead-Man Settings",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
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
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Account:({navigation}) => ({
		title: "Account",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText,
	    headerRight: <DonateButton/>
	}),
	Transfer:({navigation}) => ({
		title: "Withdraw",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Calculator:({navigation}) => ({
		title: "Calculator",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	Notifications:({navigation}) => ({
		title: "Notifications",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
	OrderBook:({navigation}) => ({
		title: "Order Book",
		headerStyle: {
	    	backgroundColor: Theme['dark'].primary1
	    },
	    headerTitleStyle:{
	    	fontFamily:Theme['dark'].fontNormal
	    },
	    headerTintColor: Theme['dark'].primaryText
	}),
}


const styles={
	button:{
		marginHorizontal:10
	},
    rowRight:{
        marginRight:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-end'
    },
    rowLeft:{
        marginLeft:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start'
    },
    logo:{
    	width:32,
    	height:32
    },
    title:{
    	fontSize:22,
    	color: Theme['dark'].primaryText,
    	marginLeft:5,
    	fontFamily:Theme['dark'].fontNormal
    }
}
