import {
		WITHDRAW_POST_STARTED,
		WITHDRAW_POST_FINISHED,
		WITHDRAW_POST_ERROR,
		MIN_FEE_GET_STARTED,
		MIN_FEE_GET_FINISHED,
		MIN_FEE_GET_ERROR	} from './Withdraw.types.js';

const defaultFee={
	"fee": 300000,
	"minFee": 20000,
	"maxFee": 10000000
}
const INIT_STATE={
	loading:true,
	error:null,
	transaction:null,
	fee:defaultFee
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case WITHDRAW_POST_STARTED:
			return {...state,loading:true, error:null}

		case WITHDRAW_POST_FINISHED:
			return {...state,loading:false, transaction:action.payload}

		case WITHDRAW_POST_ERROR:
			return {...state,loading:false, error:action.payload}

		case MIN_FEE_GET_STARTED:
			return {...state, error:null}

		case MIN_FEE_GET_FINISHED:
			return {...state, fee:action.payload}

		case MIN_FEE_GET_ERROR:
			return {...state, error:action.payload}

		default:
			return state
	}
}