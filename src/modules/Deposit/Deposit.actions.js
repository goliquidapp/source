import {
		DEPOSIT_ADDRESS_GET_STARTED,
		DEPOSIT_ADDRESS_GET_FINISHED,
		DEPOSIT_ADDRESS_GET_ERROR	} from './Deposit.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

export const getDepositAddress=()=>async dispatch=>{
	try{
		dispatch({type:DEPOSIT_ADDRESS_GET_STARTED})
		const params=`?currency=XBt`;
		await auth('GET','/user/depositAddress'+params);
		var response=await API.bitmex.get('/user/depositAddress'+params);
		dispatch({type:DEPOSIT_ADDRESS_GET_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:DEPOSIT_ADDRESS_GET_ERROR,payload:err})
	}
}