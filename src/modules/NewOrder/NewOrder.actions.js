import { CURRENT_PRICES_GET_STARTED, CURRENT_PRICES_FINISHED, CURRENT_PRICES_GET_ERROR,
		 PLACE_ORDER_POST_STARTED, PLACE_ORDER_POST_FINISHED, PLACE_ORDER_POST_ERROR } from './NewOrder.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

import store from '../../redux/store.js';

import {baseURL} from '../../config.js';

export const placeOrder=({side,orderQty,price,clOrdID, ordType, stopPx, pegOffsetValue, timeInForce, leverage, pegPriceType, execInst})=> async dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		dispatch({type:PLACE_ORDER_POST_STARTED})
		var params='';
		const data={
			symbol:currency.symbolFull,
			side,
			orderQty,
			price,
			clOrdID,
			ordType, 
			stopPx, 
			pegOffsetValue,
			timeInForce,
			pegPriceType,
			execInst
		}
		await auth('POST','/order'+params,JSON.stringify(data));
		var response=await API.bitmex.post('/order'+params,data);
		dispatch({type:PLACE_ORDER_POST_FINISHED, payload:response.data});
		if (response){
			params=`?symbol=${currency.symbolFull}&leverage=${leverage}`;
			await auth('POST','/position/leverage'+params);
			response=await API.bitmex.post('/position/leverage'+params);
		}
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:PLACE_ORDER_POST_ERROR,payload:err});
	}
}

export const getCurrentPrice=()=> async dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		dispatch({type:CURRENT_PRICES_GET_STARTED})
		const params=`?symbol=${currency.symbolFull}&depth=25`;
		await auth('GET','/orderBook/L2'+params);
		var response=await API.bitmex.get('/orderBook/L2'+params);
		var buy=response.data.find((item)=>item.side==='Buy');
		var sell=response.data.find((item)=>item.side==='Sell');
		dispatch({type:CURRENT_PRICES_FINISHED, payload:{buy,sell}});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:CURRENT_PRICES_GET_ERROR,payload:err});
	}
}
