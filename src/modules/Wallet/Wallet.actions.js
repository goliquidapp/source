import { WALLET_GET_STARTED, WALLET_GET_FINISHED, WALLET_GET_ERROR} from './Wallet.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

export const getMyWallet=()=> async dispatch =>{
	try{
		dispatch({type:WALLET_GET_STARTED})
		const params='?currency=XBt';
		await auth('GET','/user/margin'+params);
		var response=await API.bitmex.get('/user/margin'+params);
		dispatch({type:WALLET_GET_FINISHED, payload:response.data});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:WALLET_GET_ERROR,payload:err})
	}
}
