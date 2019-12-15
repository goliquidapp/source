import { RECENT_TRADES_GET_STARTED, RECENT_TRADES_GET_FINISHED, RECENT_TRADES_GET_ERROR,
		 RECENT_TRADES_WS_STARTED, RECENT_TRADES_WS_PARTIAL, RECENT_TRADES_WS_UPDATE, RECENT_TRADES_WS_DELETE, RECENT_TRADES_WS_INSERT} from './RecentTrades.types.js';

import {updateRecentTrades, deleteRecentTrades, insertRecentTrades} from './RecentTrades.helpers.js';

const INIT_STATE={
	loading:false,
	data:[],
	realtimeData:[],
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case RECENT_TRADES_GET_STARTED:
			return {...state,loading:true, error:null}

		case RECENT_TRADES_GET_FINISHED:
			return {...state,loading:false, data:action.payload}

		case RECENT_TRADES_GET_ERROR:
			return {...state,loading:false, error:action.payload}

		case RECENT_TRADES_WS_STARTED:
			return {...state,loading:true, error:null}

		case RECENT_TRADES_WS_PARTIAL:
			return {...state,loading:false, realtimeData:action.payload.sort((a,b)=>b.price-a.price)}

		case RECENT_TRADES_WS_UPDATE:
			var realtimeData=[...state.realtimeData];
			updateRecentTrades(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case RECENT_TRADES_WS_DELETE:
			var realtimeData=[...state.realtimeData];
			deleteRecentTrades(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case RECENT_TRADES_WS_INSERT:
			var realtimeData=[...state.realtimeData];
			insertRecentTrades(realtimeData,action.payload);
			realtimeData=realtimeData.slice(Math.max(realtimeData.length - 5, 1));
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}
			
		default:
			return state
	}
}