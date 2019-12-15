import { CURRENT_PRICES_GET_STARTED, CURRENT_PRICES_FINISHED, CURRENT_PRICES_GET_ERROR,
		 PLACE_ORDER_POST_STARTED, PLACE_ORDER_POST_FINISHED, PLACE_ORDER_POST_ERROR } from './NewOrder.types.js';

const INIT_STATE={
	loading:false,
	data:{buy:0,sell:0},
	placingOrder:false,
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case CURRENT_PRICES_GET_STARTED:
			return {...state,loading:true, error:null}
		case CURRENT_PRICES_FINISHED:
			return {...state,loading:false, data:action.payload}
		case CURRENT_PRICES_GET_ERROR:
			return {...state,loading:false, error:action.payload}
		case PLACE_ORDER_POST_STARTED:
			return {...state, placingOrder:true, error:null}
		case PLACE_ORDER_POST_FINISHED:
			return {...state, placingOrder:false, error:null}
		case PLACE_ORDER_POST_ERROR:
			return {...state, placingOrder:false, error:action.payload}
		default:
			return state
	}
}