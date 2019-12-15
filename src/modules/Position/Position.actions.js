import {
		POSITION_GET_STARTED,
		POSITION_GET_FINISHED,
		POSITION_GET_ERROR,
		POSITION_WS_STARTED,
		POSITION_WS_ERROR,
		POSITION_WS_PARTIAL,
		POSITION_WS_UPDATE,
		POSITION_WS_DELETE,
		POSITION_WS_INSERT,
		LEVERAGE_POST_STARTED,
		LEVERAGE_POST_FINISHED,
		LEVERAGE_POST_ERROR,
		CLOSE_POSITION_STARTED,
		CLOSE_POSITION_FINISHED,
		CLOSE_POSITION_ERROR	} from './Position.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';
import {notifyUpdate} from './Position.helpers.js';
import {getMyBalance} from '../Balance/Balance.actions.js';

export const subscribe=()=> async dispatch =>{
	try{
		var connectionExists=API.wsConnect.connect('position',['position'], (e)=>handleMessage(e)(dispatch), true,1);
		if (!connectionExists) dispatch({type:POSITION_WS_STARTED})
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:POSITION_WS_ERROR,payload:err})
	}
}


export const handleMessage= (e) => dispatch =>{
	const {data,action}=JSON.parse(e.data)
	
	if (action==='partial'){
		dispatch({type:POSITION_WS_PARTIAL, payload:data})
	}else if (action==='update'){
		dispatch({type:POSITION_WS_UPDATE, payload:data})
		notifyUpdate(data);
	}else if (action==='delete'){
		dispatch({type:POSITION_WS_DELETE, payload:data})
	}
	else if (action==='insert'){
		dispatch({type:POSITION_WS_INSERT, payload:data});
	}
}


export const updateLeverage=(value,symbol='XBTUSD')=>async dispatch=>{
	try{
		dispatch({type:LEVERAGE_POST_STARTED})
		const params=`?symbol=${symbol}&leverage=${value}`;
		await auth('POST','/position/leverage'+params);
		var response=await API.bitmex.post('/position/leverage'+params);
		dispatch({type:LEVERAGE_POST_FINISHED});

		await auth('GET','/position');
		response=await API.bitmex.get('/position');
		dispatch({type:POSITION_WS_PARTIAL, payload:response.data});
		dispatch({type:POSITION_GET_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:LEVERAGE_POST_ERROR,payload:err})
	}
}

export const closePosition=(value,symbol='XBTUSD')=>async dispatch=>{
	try{
		dispatch({type:CLOSE_POSITION_STARTED})
		const params=`?symbol=${symbol}&price=${value}`;
		await auth('POST','/order/closePosition'+params);
		var response=await API.bitmex.post('/order/closePosition'+params);
		dispatch({type:CLOSE_POSITION_FINISHED});
		
		getMyBalance()(dispatch);
		
		await auth('GET','/position');
		response=await API.bitmex.get('/position');
		dispatch({type:POSITION_WS_PARTIAL, payload:response.data});
		dispatch({type:POSITION_GET_FINISHED, payload:response.data});

	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:CLOSE_POSITION_ERROR,payload:err})
	}
}

export const getPosition=()=> async dispatch =>{
	try{
		dispatch({type:POSITION_GET_STARTED});
		const params='';
		await auth('GET','/position'+params);
		var response=await API.bitmex.get('/position'+params);
		dispatch({type:POSITION_WS_PARTIAL, payload:response.data});
		dispatch({type:POSITION_GET_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:POSITION_GET_ERROR,payload:err})
	}
}
