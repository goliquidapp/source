import {ACCOUNTS_META_START, ACCOUNTS_META_DONE} from './Accounts.types.js';

import AsyncStorage from '@react-native-community/async-storage';

import config from '../../config.js';
import {ACCOUNTS_META, CURRENT_ACCOUNT} from '../../helpers/consts.js';

export const getAccountsMeta=()=>async dispatch=>{
	try{
		dispatch({type:ACCOUNTS_META_START})
		const {accounts=[]}=JSON.parse(await AsyncStorage.getItem(ACCOUNTS_META));
		const ID=await AsyncStorage.getItem(CURRENT_ACCOUNT);
		dispatch({type:ACCOUNTS_META_DONE, payload:{accounts,current:ID}})
	}catch(err){
		if (config.debug)
			console.log(err)
	}
}