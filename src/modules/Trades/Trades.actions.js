import {TRADES_GET_STARTED,
		TRADES_GET_FINISHED,
		TRADES_GET_ERROR,
		TRADES_POSITION_GET_STARTED,
		TRADES_POSITION_GET_FINISHED,
		TRADES_POSITION_GET_ERROR,
		TRADES_WS_STARTED,
		TRADES_WS_PARTIAL,
		TRADES_WS_UPDATE,
		TRADES_WS_DELETE,
		TRADES_WS_INSERT} from './Trades.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';
import store from '../../redux/store.js';

import moment from 'moment'

export const getTrades=(startDate, endDate, interval)=> async dispatch =>{
	try{
		dispatch({type:TRADES_GET_STARTED});
		var intervalUnit={'1h':{unit:'hours'}, '5m':{unit:'minutes'}, '1m':{unit:'minutes'}, '1d':{unit:'days'}};
		var start=moment(startDate).subtract(52,intervalUnit[interval].unit).format();
		
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;

		const params=`?symbol=${currency.symbolFull}&binSize=${interval}&partial=false&partial=true&reverse=true&startTime=${start.split('T')[0]}T00%3A00%3A00.000Z&endTime=${endDate.split('T')[0]}T23%3A59%3A59.000Z`;
		await auth('GET','/trade/bucketed'+params);
		var response=await API.bitmex.get('/trade/bucketed'+params);
		dispatch({type:TRADES_GET_FINISHED, payload:response.data.reverse()})
	}catch(err){
		if (config.debug)
			console.log(JSON.stringify(err))
		dispatch({type:TRADES_GET_ERROR,payload:err})
	}
}

export const getPosition=()=> async dispatch =>{
	try{
		dispatch({type:TRADES_POSITION_GET_STARTED});

		const params=``;

		await auth('GET','/position'+params);
		var response=await API.bitmex.get('/position'+params);
		dispatch({type:TRADES_POSITION_GET_FINISHED, payload:response.data})
	}catch(err){
		if (config.debug)
			console.log(JSON.stringify(err))
		dispatch({type:TRADES_POSITION_GET_ERROR,payload:err})
	}
}


export const subscribe=()=> dispatch =>{
	try{
		var state=store.getState();
		const {settings}=state;
		const currency=settings.currency;
		
		dispatch({type:TRADES_WS_STARTED})
		API.wsConnect.connect('tradeBin1m',[`tradeBin1m:${currency.symbolFull}`], (e)=>handleMessage(e)(dispatch), dispatch, true,3);
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:TRADES_GET_ERROR,payload:err})
	}
}


export const handleMessage= (e) => dispatch =>{
	const {data,action}=JSON.parse(e.data)
	if (action==='partial'){
		dispatch({type:TRADES_WS_PARTIAL, payload:data})
	}else if (action==='update'){
		dispatch({type:TRADES_WS_UPDATE, payload:data})
	}else if (action==='delete'){
		dispatch({type:TRADES_WS_DELETE, payload:data})
	}
	else if (action==='insert'){
		dispatch({type:TRADES_WS_INSERT, payload:data})
	}
}
