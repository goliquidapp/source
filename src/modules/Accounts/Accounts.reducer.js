import {ACCOUNTS_META_START, ACCOUNTS_META_DONE} from './Accounts.types.js';

const INIT_STATE={
	accounts:[],
	current:null,
	loading:false
}

export default (state=INIT_STATE, action)=>{
	switch(action.type){
		case ACCOUNTS_META_START:
			return {...state, loading:true}
		case ACCOUNTS_META_DONE:
			const {accounts, current}=action.payload;
			return {...state, loading:false, accounts, current}
		default:
			return state;
	}
}