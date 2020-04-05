import {ADD_NOTIFICATION, LOAD_NOTIFICATIONS, CLEAR_NOTIFICATIONS} from './Notifications.types.js'

import AsyncStorage from '@react-native-community/async-storage';

import {ACCOUNTS_META, CURRENT_ACCOUNT} from '../../helpers/consts.js';

export const add=(notif)=>{
	return ({type:ADD_NOTIFICATION, payload:notif})
}

export const clear=()=>async dispatch=>{
	const ID=await AsyncStorage.getItem(CURRENT_ACCOUNT);
	await AsyncStorage.setItem('notifications'+'_'+ID,JSON.stringify({notifications:[]}));
	dispatch ({type:CLEAR_NOTIFICATIONS})
}

export const loadNotifications=()=>async dispatch=>{
	const ID=await AsyncStorage.getItem(CURRENT_ACCOUNT);
	const data = await AsyncStorage.getItem('notifications'+'_'+ID);
	if (data){
	    const notifications=JSON.parse(data).notifications;
	    dispatch({
			type:LOAD_NOTIFICATIONS,
			payload:notifications
		});
	}else{
		dispatch({
			type:LOAD_NOTIFICATIONS,
			payload:[]
		});
	}
}