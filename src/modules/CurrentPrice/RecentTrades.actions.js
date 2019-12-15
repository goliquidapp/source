import { RECENT_TRADES_GET_STARTED, RECENT_TRADES_GET_FINISHED, RECENT_TRADES_GET_ERROR,
		 RECENT_TRADES_WS_STARTED, RECENT_TRADES_WS_PARTIAL, RECENT_TRADES_WS_UPDATE, RECENT_TRADES_WS_DELETE, RECENT_TRADES_WS_INSERT} from './RecentTrades.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';
import {notify} from '../../helpers/notifications.js';

import store from '../../redux/store.js';

export const getRecentTrades=()=> async dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		dispatch({type:RECENT_TRADES_GET_STARTED})
		const params=`?symbol=${currency.symbolFull}&reverse=true&count=10`;
		await auth('GET','/trade'+params);
		var response=await API.bitmex.get('/trade'+params);
		dispatch({type:RECENT_TRADES_WS_PARTIAL, payload:response.data});
		dispatch({type:RECENT_TRADES_GET_FINISHED, payload:response.data})
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:RECENT_TRADES_GET_ERROR,payload:err})
	}
}

export const subscribe=()=> dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		dispatch({type:RECENT_TRADES_WS_STARTED})
		API.wsConnect.connect('trade',[`trade:${currency.symbolFull}`], (e)=>handleMessage(e)(dispatch), false);
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:RECENT_TRADES_GET_ERROR,payload:err})
	}
}


export const unsubscribe=(currency)=>dispatch=>{
	try{
		API.wsConnect.disconnect('trade',[`trade:${currency.symbolFull}`]);
		dispatch({type:RECENT_TRADES_WS_PARTIAL, payload:[]})
	}catch(err){
		if (config.debug)
			console.log(err)
	}
}

export const handleMessage= (e) => dispatch =>{
	const {data,action}=JSON.parse(e.data)
	if (action==='partial'){
		dispatch({type:RECENT_TRADES_WS_PARTIAL, payload:data})
	}else if (action==='update'){
		dispatch({type:RECENT_TRADES_WS_UPDATE, payload:data})
	}else if (action==='delete'){
		dispatch({type:RECENT_TRADES_WS_DELETE, payload:data})
	}
	else if (action==='insert'){
		dispatch({type:RECENT_TRADES_WS_INSERT, payload:data})
	}
}
