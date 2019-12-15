import {ADD_NOTIFICATION, LOAD_NOTIFICATIONS, CLEAR_NOTIFICATIONS} from './Notifications.types.js'

import AsyncStorage from '@react-native-community/async-storage';

export const add=(notif)=>{
	return ({type:ADD_NOTIFICATION, payload:notif})
}

export const clear=()=>async dispatch=>{
	await AsyncStorage.setItem('notifications',JSON.stringify({notifications:[]}));
	dispatch ({type:CLEAR_NOTIFICATIONS})
}