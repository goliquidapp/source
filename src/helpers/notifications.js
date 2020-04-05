import {AppState} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Notification} from "react-native-in-app-message";
import PushNotification from 'react-native-push-notification';

import {NOTIFICATION_SHOW} from '../modules/GlobalNotification/GlobalNotification.types.js';
import {ADD_NOTIFICATION} from '../modules/Notifications/Notifications.types.js';
import {CLEAR_SCHEDULE, SET_SCHEDULE, SET_COMPONENT, SET_SHOW} from '../modules/ScheduledPopup/ScheduledPopup.types.js';

import {CURRENT_ACCOUNT} from './consts.js';

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

	if (bg) cacheNotification({title, body, type});
}

export const cacheNotification=async ({title, body, type, _id}, notificationData=null)=>{
    if (_id){
        const notifications=store.getState().notifications.notifications;
        const found=notifications.find((n)=>n._id===_id);
        console.log(found)
        if (found) return;
    }
	const time=moment().format('lll')
	store.dispatch({
		type:ADD_NOTIFICATION,
		payload:{
			title,
			body,
			time,
			type,
			_id,
			notificationData
		}
	});
	const ID=await AsyncStorage.getItem(CURRENT_ACCOUNT);
	const data = await AsyncStorage.getItem('notifications'+'_'+ID);
	var notifications=[];
	if (data)
		notifications=JSON.parse(data).notifications;
	notifications.push({title,body,type, _id, time, notificationData});
	await AsyncStorage.setItem('notifications'+'_'+ID,JSON.stringify({notifications}));
}

export const clearPopupSchedule=()=>{
	store.dispatch({
		type: CLEAR_SCHEDULE
	})
}

export const schedulePopup=(schedule, children, onClose=clearPopupSchedule)=>{
	store.dispatch({
		type: SET_SCHEDULE,
		payload: {
			schedule,
			children,
			onClose
		}
	});
}


export const displayPopup=(children)=>{
	store.dispatch({
		type: SET_SHOW,
		payload:{
			show:true,
			children,
			onClose:clearPopupSchedule
		}
	})
}
