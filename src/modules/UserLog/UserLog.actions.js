import { USERLOG_GET_STARTED, USERLOG_GET_FINISHED, USERLOG_GET_ERROR} from './UserLog.types.js';

import API from '../../api/API.js';
import {auth} from '../../helpers/bitmex.helpers.js';
import config from '../../config.js';

import {baseURL} from '../../config.js';

export const getUserLog=()=> async dispatch =>{
	try{
		dispatch({type:USERLOG_GET_STARTED})
		const params='';
		await auth('GET','/userEvent'+params);
		var response=await API.bitmex.get('/userEvent'+params);
		dispatch({type:USERLOG_GET_FINISHED, payload:response.data.userEvents});
	}catch(err){
		if (config.debug)
			console.log(err)
		dispatch({type:USERLOG_GET_ERROR,payload:err})
	}
}
