import { WALLET_GET_STARTED, WALLET_GET_FINISHED, WALLET_GET_ERROR} from './Wallet.types.js';

const INIT_STATE={
	loading:true,
	data:[],
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case WALLET_GET_STARTED:
			return {...state,loading:true, error:null}
		case WALLET_GET_FINISHED:
			return {...state,loading:false, data:action.payload}
		case WALLET_GET_ERROR:
			return {...state,loading:false, error:action.payload}
		default:
			return state
	}
}