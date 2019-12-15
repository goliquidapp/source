import {TRADES_GET_STARTED,
		TRADES_GET_FINISHED,
		TRADES_GET_ERROR,
		TRADES_POSITION_GET_STARTED,
		TRADES_POSITION_GET_FINISHED,
		TRADES_POSITION_GET_ERROR,
		TRADES_WS_STARTED,
		TRADES_WS_PARTIAL,
		TRADES_WS_UPDATE,
		TRADES_WS_DELETE,
		TRADES_WS_INSERT} from './Trades.types.js';

import {updateTrades, deleteTrades, insertTrades} from './Trades.helpers.js';

const INIT_STATE={
	loading:false,
	data:[],
	position:[],
	realtimeData:[],
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case TRADES_GET_STARTED:
			return {...state,loading:true, error:null}

		case TRADES_GET_FINISHED:
			return {...state,loading:false, data:action.payload}

		case TRADES_GET_ERROR:
			return {...state,loading:false, error:action.payload}

		case TRADES_POSITION_GET_STARTED:
			return {...state,error:null}

		case TRADES_POSITION_GET_FINISHED:
			return {...state, position:action.payload}

		case TRADES_POSITION_GET_ERROR:
			return {...state, error:action.payload}

		case TRADES_WS_STARTED:
			return {...state,loading:true, error:null}

		case TRADES_WS_PARTIAL:
			return {...state,loading:false, realtimeData:action.payload.sort((a,b)=>b.price-a.price)}

		case TRADES_WS_UPDATE:
			var realtimeData=[...state.realtimeData];
			updateTrades(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case TRADES_WS_DELETE:
			var realtimeData=[...state.realtimeData];
			deleteTrades(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case TRADES_WS_INSERT:
			var realtimeData=[...state.realtimeData];
			insertTrades(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}
			
		default:
			return state
	}
}