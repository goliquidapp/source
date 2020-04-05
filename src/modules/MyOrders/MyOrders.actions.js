import { MYORDERS_GET_STARTED,
		 MYORDERS_GET_FINISHED, 
		 MYORDERS_GET_ERROR,
		 MYORDERS_WS_STARTED,
		 MYORDERS_WS_ERROR,
		 MYORDERS_WS_PARTIAL,
		 MYORDERS_WS_UPDATE,
		 MYORDERS_WS_DELETE,
		 MYORDERS_WS_INSERT 	} from './MyOrders.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';
import {notifyUpdate, notifyInsert} from './MyOrders.helpers.js';

import {getPosition} from '../Position/Position.actions.js';

export const getMyOrders=()=> async dispatch =>{
	try{
		dispatch({type:MYORDERS_GET_STARTED});
		const params='?reverse=true&count=100';
		await auth('GET','/order'+params);
		var response=await API.bitmex.get('/order'+params);
		dispatch({type:MYORDERS_GET_FINISHED, payload:response.data});
		dispatch({type:MYORDERS_WS_PARTIAL, payload:response.data})
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:MYORDERS_GET_ERROR,payload:err})
	}
}


export const deleteOrder=({orderID})=> async dispatch =>{
	try{
		dispatch({type:MYORDERS_GET_STARTED})
		const params='';
		const data={
			orderID:[orderID]
		};
		await auth('DELETE','/order'+params,JSON.stringify(data));
		var response=await API.bitmex.delete('/order'+params,{data});
		getMyOrders()(dispatch)
	}catch(err){
		if (config.debug)
			console.log(JSON.stringify(err))
		dispatch({type:MYORDERS_GET_ERROR,payload:err})
	}
}

export const deleteOrders=(ordersIDs)=> async dispatch =>{
	try{
		dispatch({type:MYORDERS_GET_STARTED})
		const params='';
		const data={
			orderID:ordersIDs
		};
		await auth('DELETE','/order'+params,JSON.stringify(data));
		var response=await API.bitmex.delete('/order'+params,{data});
		getMyOrders()(dispatch)
	}catch(err){
		if (config.debug)
			console.log(JSON.stringify(err))
		dispatch({type:MYORDERS_GET_ERROR,payload:err})
	}
}

export const subscribe=()=> dispatch =>{
	try{
		dispatch({type:MYORDERS_WS_STARTED})
		API.wsConnect.connect('order',['order'], (e)=>handleMessage(e)(dispatch),true,1);
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:MYORDERS_WS_ERROR,payload:err})
	}
}

export const handleMessage= (e) => dispatch =>{
	const {data,action}=JSON.parse(e.data)
	if (action==='partial'){
		dispatch({type:MYORDERS_WS_UPDATE, payload:data})
	}else if (action==='update'){
		dispatch({type:MYORDERS_WS_UPDATE, payload:data})
		notifyUpdate(data);
		getPosition()(dispatch);
	}else if (action==='delete'){
		dispatch({type:MYORDERS_WS_DELETE, payload:data})
	}
	else if (action==='insert'){
		dispatch({type:MYORDERS_WS_INSERT, payload:data})
		notifyInsert(data)
	}
}

export default {
	subscribe,
	getMyOrders
}
