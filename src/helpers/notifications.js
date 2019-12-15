import {AppState} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Notification} from "react-native-in-app-message";
import PushNotification from 'react-native-push-notification';

import {NOTIFICATION_SHOW} from '../modules/GlobalNotification/GlobalNotification.types.js';
import {ADD_NOTIFICATION} from '../modules/Notifications/Notifications.types.js'

import store from '../redux/store.js';

import moment from 'moment';

const image=require('../resources/icons/icon.png');
 
export const notify=async ({title, body, type}, bg=true)=>{
	const background=!(AppState.currentState.match(/active/));
	var state=store.getState();
	const {settings}=state;
	if (background && bg){
		if (settings.allowNotifications){
			let notif=PushNotification.localNotification({
		        title,
		        message:body
		    });
		}
	}else{
		if (settings.showInAppNotifications){
			store.dispatch({
				type:NOTIFICATION_SHOW,
				payload:{
					title,
					body,
					image,
					type
				}
			});
			Notification.show();
		}
	}
	if (bg){
		const time=moment().format('lll')
		store.dispatch({
			type:ADD_NOTIFICATION,
			payload:{
				title,
				body,
				time,
				type
			}
		});
		const data = await AsyncStorage.getItem('notifications');
		var notifications=[];
		if (data)
			notifications=JSON.parse(data).notifications;
		notifications.push({title,body,type, time});
		await AsyncStorage.setItem('notifications',JSON.stringify({notifications}));
	}
}
