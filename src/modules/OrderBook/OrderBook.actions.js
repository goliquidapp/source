import { ORDER_BOOK_GET_STARTED, ORDER_BOOK_GET_FINISHED, ORDER_BOOK_GET_ERROR,
		 ORDER_BOOK_WS_STARTED, ORDER_BOOK_WS_PARTIAL, ORDER_BOOK_WS_UPDATE, 
		 ORDER_BOOK_WS_DELETE, ORDER_BOOK_WS_INSERT, ORDER_BOOK_WS_FLUSH,
		ORDER_BOOK_RESET_UPDATE_FREQ} from './OrderBook.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';
import {notify} from '../../helpers/notifications.js';

import store from '../../redux/store.js';

export const getOrderBook=()=> async dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		dispatch({type:ORDER_BOOK_GET_STARTED})
		const params=`?symbol=${currency.symbolFull}&depth=25`;
		await auth('GET','/orderBook/L2'+params);
		var response=await API.bitmex.get('/orderBook/L2'+params);
		dispatch({type:ORDER_BOOK_WS_PARTIAL, payload:response.data});
		dispatch({type:ORDER_BOOK_GET_FINISHED, payload:response.data})
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:ORDER_BOOK_GET_ERROR,payload:err})
	}
}

export const subscribe=()=> dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		dispatch({type:ORDER_BOOK_WS_STARTED})
		API.wsConnect.connect('orderBookL2_25',[`orderBookL2_25:${currency.symbolFull}`], (e)=>handleMessage(e)(dispatch));
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:ORDER_BOOK_GET_ERROR,payload:err})
	}
}

export const unsubscribe=(currency)=>dispatch=>{
	try{
		API.wsConnect.disconnect('orderBookL2_25',[`orderBookL2_25:${currency.symbolFull}`]);
		dispatch({type:ORDER_BOOK_WS_PARTIAL, payload:[]})
	}catch(err){
		if (config.debug)
			console.log(err)
	}
}

export const handleMessage= (e) => dispatch =>{
	const {data,action}=JSON.parse(e.data)
	if (action==='partial'){
		dispatch({type:ORDER_BOOK_WS_PARTIAL, payload:data})
	}else if (action==='update'){
		dispatch({type:ORDER_BOOK_WS_UPDATE, payload:data})
	}else if (action==='delete'){
		dispatch({type:ORDER_BOOK_WS_DELETE, payload:data})
	}
	else if (action==='insert'){
		dispatch({type:ORDER_BOOK_WS_INSERT, payload:data})
	}
}

export const resetUpdateFrequency=()=>{
	return {type:ORDER_BOOK_RESET_UPDATE_FREQ}
}

export const flush=()=>{
	return {type:ORDER_BOOK_WS_FLUSH}
}