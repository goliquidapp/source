import {
		BALANCE_GET_STARTED,
		BALANCE_GET_FINISHED,
		BALANCE_GET_ERROR,
		BALANCE_WS_STARTED,
		BALANCE_WS_ERROR,
		BALANCE_WS_PARTIAL,
		BALANCE_WS_UPDATE,
		BALANCE_WS_DELETE,
		BALANCE_WS_INSERT	} from './Balance.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

export const getMyBalance=()=> async dispatch =>{
	try{
		dispatch({type:BALANCE_GET_STARTED});
		const params='?currency=XBt';
		await auth('GET','/user/margin'+params);
		var response=await API.bitmex.get('/user/margin'+params);
		dispatch({type:BALANCE_WS_PARTIAL, payload:[response.data]});
		dispatch({type:BALANCE_GET_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:BALANCE_GET_ERROR,payload:err})
	}
}

export const subscribe=()=> async dispatch =>{
	try{
		var connectionExists=API.wsConnect.connect('margin',['margin'], (e)=>handleMessage(e)(dispatch), true,1);
		if (!connectionExists) dispatch({type:BALANCE_WS_STARTED})
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:BALANCE_WS_ERROR,payload:err})
	}
}


export const handleMessage= (e) => dispatch =>{
	const {data,action}=JSON.parse(e.data)
	if (action==='partial'){
		dispatch ({type:BALANCE_WS_PARTIAL, payload:data})
	}else if (action==='update'){
		dispatch ({type:BALANCE_WS_UPDATE, payload:data})
	}else if (action==='delete'){
		dispatch ({type:BALANCE_WS_DELETE, payload:data})
	}
	else if (action==='insert'){
		dispatch ({type:BALANCE_WS_INSERT, payload:data})
	}
}
