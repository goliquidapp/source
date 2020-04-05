import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, Platform} from 'react-native';
import {Icon} from 'react-native-elements';
import { Checkbox, Button } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';

import { connect } from 'react-redux';

import {clear, loadNotifications} from './Notifications.actions.js';
import {updateSettings} from '../Settings/Settings.actions.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import * as Animatable from 'react-native-animatable';

import {displayPopup} from '../../helpers/notifications.js';
import PopupPublication from '../../components/PopupPublication/PopupPublication.component.js';
import Popup from '../../components/Popup/Popup.component.js';

const isIOS = Platform.OS === 'ios';

class Notifications extends Component{
	state={
		clearing:false, 
		showNotificationsOptions:false, 
		settings:null
	}
	componentDidMount(){
		this.props.loadNotifications();
		this.setState({settings:this.props.settings});
	}
	componentDidUpdate(prevProps){
		if (prevProps.settings.appID!==this.props.settings.appID && this.props.settings.appID){
			this.props.loadNotifications();
		}
	}
	subscribe=async (channel)=>{
		try{
			if (isIOS) await messaging().subscribeToTopic(channel+'_ios');
			else await messaging().subscribeToTopic(channel);
		}catch(err){
			if (config.debug)
				console.log(err);
		}
	}
	unsubscribe=async (channel)=>{
		try{
			if (isIOS) await messaging().subscribeToTopic(channel+'_ios');
			else await messaging().unsubscribeFromTopic(channel);
		}catch(err){
			if (config.debug)
				console.log(err);
		}
	}
	clearNotifications=()=>{
		this.setState({clearing:true},()=>setTimeout(this.props.clear,300))
	}
	saveSettings=()=>{
		const {notificationsSettings}=this.state.settings;

		this.props.updateSettings(this.state.settings);

		if (notificationsSettings.highOrdersNotifications){
			const channels=this.props.settings.channels.filter((item)=>item.enabled&&item.type==='High Trades');
			channels.map((channel)=>this.subscribe(channel.label));

		}else if (!notificationsSettings.highOrdersNotifications){
			const channels=this.props.settings.channels.filter((item)=>item.enabled&&item.type==='High Trades');
			channels.map((channel)=>this.unsubscribe(channel.label));

		}

		if (notificationsSettings.publicationNotifications){
			const channels=this.props.settings.channels.filter((item)=>item.enabled&&item.type==='Publications');
			channels.map((channel)=>this.subscribe(channel.label));

		}else if (!notificationsSettings.publicationNotifications){
			const channels=this.props.settings.channels.filter((item)=>item.enabled&&item.type==='Publications');
			channels.map((channel)=>this.unsubscribe(channel.label));

		}

		this.hideNotificationsOptions();
	}
	handleNotification=(notif)=>{
		if (notif.notificationData){
            displayPopup(<PopupPublication content={notif.notificationData}/>);
		}
	}
	renderNotifications=()=>{
		const {clearing}=this.state;
		const {notifications}=this.props.notifications;
		if (notifications.length===0) return <Text style={styles.empty}>No Notifications</Text>
		const cards=[]
		notifications.map((notif, index)=>{
			cards.push(
				<Animatable.View  	style={[styles.card, styles.theme[notif.type]]}
									key={index.toString()} animation={clearing?"slideOutRight":"slideInRight"} 
									useNativeDriver 
									duration={100+(index+1)*10} >
					<TouchableOpacity onPress={()=>this.handleNotification(notif)}>
						<Text style={styles.title}>{notif.title}</Text>
						<Text style={styles.body}>{notif.body}</Text>
						<View style={styles.type}>
							<Text style={styles.type}>{notif.time}</Text>
						</View>
					</TouchableOpacity>
				</Animatable.View>
			)
		})
		return cards.reverse()
	}
	renderNotificationsOptions=()=>{
		const {showNotificationsOptions, settings}=this.state;
		if (!showNotificationsOptions) return
		
		const {notificationsSettings}=this.state.settings;

		return (
			<Popup 	visible={showNotificationsOptions} 
					onClose={this.hideNotificationsOptions}>
				<View style={styles.dialog}>
					<View style={styles.row}>
						<Text 		style={styles.label}>Publication Notifications</Text>
						<Checkbox 	color={Theme['dark'].highlighted} 
									status={notificationsSettings.publicationNotifications ? 'checked' : 'unchecked'}
									onPress={()=>this.setState({
										settings:{
											...settings,
											notificationsSettings:{
												...notificationsSettings,
												publicationNotifications:!notificationsSettings.publicationNotifications
											}
										}
									})}/>
					</View>
					<View style={styles.row}>
						<Text 		style={styles.label}>High Trades Notifications</Text>
						<Checkbox 	color={Theme['dark'].highlighted} 
									status={notificationsSettings.highOrdersNotifications ? 'checked' : 'unchecked'}
									onPress={()=>this.setState({
										settings:{
											...settings,
											notificationsSettings:{
												...notificationsSettings,
												highOrdersNotifications:!notificationsSettings.highOrdersNotifications
											}
										}
									})}/>
					</View>
					<View style={[styles.row, styles.right]}>
						<Button labelStyle={styles.buttonTextStyle} mode={'text'} color={Theme['dark'].highlighted} onPress={this.saveSettings}>Apply</Button>
						<Button labelStyle={styles.buttonTextStyle} mode={'text'} color={Theme['dark'].highlighted} onPress={this.hideNotificationsOptions}>Cancel</Button>
					</View>
				</View>
			</Popup>
		)
	}
	showNotificationsOptions=()=>{
		this.setState({showNotificationsOptions:true})
	}
	hideNotificationsOptions=()=>{
		this.setState({showNotificationsOptions:false})
	}
	renderBar=()=>{
		return(
			<View style={styles.bar}>
				<TouchableOpacity onPress={this.showNotificationsOptions}>
					<Icon name="notifications-active" type="material-icons" color={Theme['dark'].secondaryText} containerStyle={styles.icon}/>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.clearNotifications}>
					<Icon name="clear-all" type="material-icons" color={Theme['dark'].secondaryText} containerStyle={styles.icon}/>
				</TouchableOpacity>
			</View>
		)
	}
	render(){
		return (
			<ScrollView>
				<View style={styles.container}>
					{this.renderBar()}
					{this.renderNotifications()}
					{this.renderNotificationsOptions()}
				</View>
			</ScrollView>
		)
	}
}

const styles={
	container:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		height: '100%',
		alignSelf:'center'
	},
	dialog:{
		width:'90%',
		backgroundColor:Theme['dark'].primary3,
		alignSelf:'center',
		padding:20,
		borderRadius:20
	},
	row:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		marginVertical:10
	},
	right:{
		justifyContent:'flex-end'
	},
	card:{
		width: '90%',
		paddingHorizontal:10,
		paddingVertical:15,
		borderRadius: 8,
		backgroundColor: Theme['dark'].primary3,
		marginVertical:10
	},
	title:{
		fontFamily:Theme['dark'].fontBold,
		fontSize:16,
		fontWeight:'bold',
		color: Theme['dark'].primaryText,
		marginBottom:20,
		width: '60%'
	},
	body:{
		fontFamily:Theme['dark'].fontNormal,
		fontSize:14,
		color: Theme['dark'].primaryText
	},
	type:{
		position:'absolute',
		top:5,
		right:5,
		color:Theme['dark'].secondaryText,
		fontFamily:Theme['dark'].fontNormal,
		fontSize: 10
	},
	theme:{
		warning:{
			borderLeftColor:Colors['Drover'],
			borderLeftWidth:5
		},
		danger:{
			borderLeftColor:Colors['Beauty Bush'],
			borderLeftWidth:5
		},
		info:{
			borderLeftColor:Colors['Charlotte'],
			borderLeftWidth:5
		},
		success:{
			borderLeftColor:Colors['Tea Green'],
			borderLeftWidth:5
		}
	},
	empty:{
		marginTop:'auto',
		marginBottom:'auto',
		paddingVertical:20,
		paddingHorizontal:10,
		color:Theme['dark'].primaryText,
		fontSize:20,
		fontFamily:Theme['dark'].fontNormal
	},
	bar:{
		paddingVertical:5,
		width: '95%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-end'
	},
	icon:{
		marginHorizontal:10
	},
	label:{
		marginLeft:10,
		color:Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontNormal
	},
	buttonTextStyle:{
		fontFamily:Theme['dark'].fontNormal
	}
}

const mapStateToProps=(state)=>{
	return {
		notifications:state.notifications,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{clear, loadNotifications, updateSettings})(Notifications);
