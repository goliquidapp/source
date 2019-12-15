import {
		BALANCE_GET_STARTED,
		BALANCE_GET_FINISHED,
		BALANCE_GET_ERROR,
		BALANCE_WS_STARTED,
		BALANCE_WS_ERROR,
		BALANCE_WS_PARTIAL,
		BALANCE_WS_UPDATE,
		BALANCE_WS_DELETE,
		BALANCE_WS_INSERT	} from './Balance.types.js';

import {updateBalance, deleteBalance, insertBalance} from './Balance.helpers.js';

const INIT_STATE={
	loading:true,
	data:[],
	realtimeData:[],
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case BALANCE_GET_STARTED:
			return {...state,loading:true, error:null}

		case BALANCE_GET_FINISHED:
			return {...state,loading:false, data:action.payload}

		case BALANCE_GET_ERROR:
			return {...state,loading:false, error:action.payload}

		case BALANCE_WS_STARTED:
			return {...state,loading:true, error:null}

		case BALANCE_WS_PARTIAL:
			return {...state,loading:false, realtimeData:action.payload.sort((a,b)=>b.price-a.price)}

		case BALANCE_WS_UPDATE:
			var realtimeData=[...state.realtimeData];
			updateBalance(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case BALANCE_WS_DELETE:
			var realtimeData=[...state.realtimeData];
			deleteBalance(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case BALANCE_WS_INSERT:
			var realtimeData=[...state.realtimeData];
			insertBalance(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}
		default:
			return state
	}
}