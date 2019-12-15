import { SUMMARY_GET_STARTED, SUMMARY_GET_FINISHED, SUMMARY_GET_ERROR} from './Summary.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

import {baseURL} from '../../config.js';

export const getSummary=()=> async dispatch =>{
	try{
		dispatch({type:SUMMARY_GET_STARTED})
		const params='?symbol=XBTUSD&depth=25';
		await auth('GET','/orderBook/L2'+params);
		var response=await API.bitmex.get('/orderBook/L2'+params);
		var buy=response.data.find((item)=>item.side==='Buy');
		var sell=response.data.find((item)=>item.side==='Sell');
		dispatch({type:SUMMARY_GET_FINISHED, payload:{buy,sell}});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:SUMMARY_GET_ERROR,payload:err})
	}
}
