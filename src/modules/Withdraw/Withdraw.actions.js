import {
		WITHDRAW_POST_STARTED,
		WITHDRAW_POST_FINISHED,
		WITHDRAW_POST_ERROR,
		MIN_FEE_GET_STARTED,
		MIN_FEE_GET_FINISHED,
		MIN_FEE_GET_ERROR	} from './Withdraw.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

export const requestWithdrawal=({otpToken, amount, address, text})=>async dispatch=>{
	try{
		dispatch({type:WITHDRAW_POST_STARTED})
		const params=``;
		const data={
			otpToken,
			currency:'XBt',
			amount,
			address,
			text
		};
		await auth('POST','/user/requestWithdrawal'+params,JSON.stringify(data));
		var response=await API.bitmex.post('/user/requestWithdrawal'+params,JSON.stringify(data));
		dispatch({type:WITHDRAW_POST_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:WITHDRAW_POST_ERROR,payload:err})
	}
}


export const getMinFee=()=>async dispatch=>{
	try{
		dispatch({type:MIN_FEE_GET_STARTED})
		const params=`?currency=XBt`;
		await auth('GET','/user/minWithdrawalFee'+params);
		var response=await API.bitmex.get('/user/minWithdrawalFee'+params);
		dispatch({type:MIN_FEE_GET_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:MIN_FEE_GET_ERROR,payload:err})
	}
}