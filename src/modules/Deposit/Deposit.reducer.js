import {
		DEPOSIT_ADDRESS_GET_STARTED,
		DEPOSIT_ADDRESS_GET_FINISHED,
		DEPOSIT_ADDRESS_GET_ERROR	} from './Deposit.types.js';


const INIT_STATE={
	loading:true,
	data:[],
	error:null,
	address:'',
	loadingAddress:true
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case DEPOSIT_ADDRESS_GET_STARTED:
			return {...state,loadingAddress:true, error:null}

		case DEPOSIT_ADDRESS_GET_FINISHED:
			return {...state,loadingAddress:false, address:action.payload}

		case DEPOSIT_ADDRESS_GET_ERROR:
			return {...state,loadingAddress:false, error:action.payload}

		default:
			return state
	}
}