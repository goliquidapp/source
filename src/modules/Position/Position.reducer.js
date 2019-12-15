import {
		POSITION_GET_STARTED,
		POSITION_GET_FINISHED,
		POSITION_GET_ERROR,
		CLOSE_POSITION_STARTED,
		CLOSE_POSITION_FINISHED,
		POSITION_WS_STARTED,
		POSITION_WS_ERROR,
		POSITION_WS_PARTIAL,
		POSITION_WS_UPDATE,
		POSITION_WS_DELETE,
		POSITION_WS_INSERT,
		LEVERAGE_POST_STARTED,
		LEVERAGE_POST_FINISHED,
		LEVERAGE_POST_ERROR	} from './Position.types.js';

import {updatePosition, deletePosition, insertPosition} from './Position.helpers.js';

const INIT_STATE={
	loading:true,
	data:[],
	error:null,
	realtimeData:[],
	closingPosition:false,
	loadingLeverage:false
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case POSITION_GET_STARTED:
			return {...state,loading:true, error:null}

		case POSITION_GET_FINISHED:
			return {...state,loading:false, data:action.payload.filter((position)=>position.isOpen)}

		case POSITION_GET_ERROR:
			return {...state,loading:false, error:action.payload}

		case LEVERAGE_POST_STARTED:
			return {...state,loadingLeverage:true}

		case LEVERAGE_POST_FINISHED:
			return {...state,loadingLeverage:false}

		case CLOSE_POSITION_STARTED:
			return {...state, closingPosition:true}

		case CLOSE_POSITION_FINISHED:
			return {...state, closingPosition:false}

		case POSITION_WS_STARTED:
			return {...state,loading:true, error:null}

		case POSITION_WS_PARTIAL:
			return {...state,loading:false, realtimeData:action.payload.filter((position)=>position.isOpen)}

		case POSITION_WS_UPDATE:
			var realtimeData=[...state.realtimeData];
			updatePosition(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.filter((position)=>position.isOpen)}

		case POSITION_WS_DELETE:
			var realtimeData=[...state.realtimeData];
			deletePosition(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.filter((position)=>position.isOpen)}

		case POSITION_WS_INSERT:
			var realtimeData=[...state.realtimeData];
			insertPosition(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.filter((position)=>position.isOpen)}
		default:
			return state
	}
}