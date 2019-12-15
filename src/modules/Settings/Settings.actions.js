import { UPDATE_SETTINGS,
		 SET_DEADMAN_INTERVAL,
		 CLEAR_DEADMAN_INTERVAL,
		 SET_VALID_AUTH,
		 START_VALID_AUTH,
		 SET_VALID_ERROR } from './Settings.types.js';

import AsyncStorage from '@react-native-community/async-storage';

import API from '../../api/API.js';
import config from '../../config.js'
import {auth} from '../../helpers/bitmex.helpers.js';

import {saveAppAuth} from '../../helpers/bitmex.helpers.js';

export const updateAuthSettings=(data)=>async dispatch=>{
	await saveAppAuth(data);
	dispatch({type:UPDATE_SETTINGS, payload:{...data}})
}

export const updateSettings=(data)=>async dispatch=>{
	await AsyncStorage.setItem('Settings',JSON.stringify(data))
	dispatch({type:UPDATE_SETTINGS, payload:{...data}})
}

export const validateAuth=(data)=>async dispatch=>{
	try{
		dispatch({type:START_VALID_AUTH})
		const params='';
		await auth('GET','/user'+params,'',data);
		var response=await API.bitmex.get('/user'+params);
		dispatch({type:SET_VALID_AUTH});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:SET_VALID_ERROR,payload:err});
	}
}

export const clearAuth=()=>{
	return {type:SET_VALID_ERROR,payload:null}
}

export const setDeadMan=(timeout, interval)=>async dispatch=>{
	try{
		if (interval){
			dispatch({type:CLEAR_DEADMAN_INTERVAL})
			const intervalObj=setInterval(
				async ()=>{
					const params='';
					const data={
						timeout:timeout*1000
					}
					await auth('POST','/order/cancelAllAfter',JSON.stringify(data));
					var response=await API.bitmex.post('/order/cancelAllAfter',data);
				},interval*1000)
			dispatch({type:SET_DEADMAN_INTERVAL, payload:intervalObj})
		}else{
			const params='';
			const data={
				timeout:0
			}
			await auth('POST','/order/cancelAllAfter',JSON.stringify(data));
			var response=await API.bitmex.post('/order/cancelAllAfter',data);
			dispatch({type:CLEAR_DEADMAN_INTERVAL})
		}
	}catch(err){
		if (config.debug)
			console.log(err)
	}
}

export default {
	setDeadMan
}
