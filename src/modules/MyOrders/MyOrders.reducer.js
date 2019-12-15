import { MYORDERS_GET_STARTED,
		 MYORDERS_GET_FINISHED, 
		 MYORDERS_GET_ERROR,
		 MYORDERS_WS_STARTED,
		 MYORDERS_WS_ERROR,
		 MYORDERS_WS_PARTIAL,
		 MYORDERS_WS_UPDATE,
		 MYORDERS_WS_DELETE,
		 MYORDERS_WS_INSERT 	} from './MyOrders.types.js';


import {updateOrders, deleteOrders, insertOrders} from './MyOrders.helpers.js';

const INIT_STATE={
	loading:false,
	data:[],
	error:null,
	realtimeData:[],
	loadingWS:true
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case MYORDERS_GET_STARTED:
			return {...state,loading:true, error:null}

		case MYORDERS_GET_FINISHED:
			return {...state,loading:false, data:action.payload}

		case MYORDERS_GET_ERROR:
			return {...state,loading:false, error:action.payload}

		case MYORDERS_WS_STARTED:
			return {...state,loading:true, error:null}

		case MYORDERS_WS_PARTIAL:
			return {...state,loadingWS:false, realtimeData:action.payload.sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())}

		case MYORDERS_WS_UPDATE:
			var realtimeData=[...state.realtimeData];
			updateOrders(realtimeData,action.payload)
			return {...state,loadingWS:false, realtimeData: realtimeData.sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())}

		case MYORDERS_WS_DELETE:
			var realtimeData=[...state.realtimeData];
			deleteOrders(realtimeData,action.payload)
			return {...state,loadingWS:false, realtimeData: realtimeData.sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())}

		case MYORDERS_WS_INSERT:
			var realtimeData=[...state.realtimeData];
			insertOrders(realtimeData,action.payload)
			return {...state,loadingWS:false, realtimeData: realtimeData.sort((a,b)=>new Date(b.timestamp).getTime()-new Date(a.timestamp).getTime())}

		default:
			return state
	}
}