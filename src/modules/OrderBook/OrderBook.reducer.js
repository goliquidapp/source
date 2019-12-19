import { ORDER_BOOK_GET_STARTED, ORDER_BOOK_GET_FINISHED, ORDER_BOOK_GET_ERROR,
		 ORDER_BOOK_WS_STARTED, ORDER_BOOK_WS_PARTIAL, ORDER_BOOK_WS_UPDATE,
		 ORDER_BOOK_WS_DELETE, ORDER_BOOK_WS_INSERT, ORDER_BOOK_WS_FLUSH} from './OrderBook.types.js';

import {updateOrderBook, deleteOrderBook, insertOrderBook} from './OrderBook.helpers.js';

const INIT_STATE={
	loading:false,
	data:[],
	realtimeData:[],
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case ORDER_BOOK_GET_STARTED:
			return {...state,loading:true, error:null}

		case ORDER_BOOK_GET_FINISHED:
			return {...state,loading:false, data:action.payload}

		case ORDER_BOOK_GET_ERROR:
			return {...state,loading:false, error:action.payload}

		case ORDER_BOOK_WS_STARTED:
			return {...state,loading:true, error:null}

		case ORDER_BOOK_WS_PARTIAL:
			return {...state,loading:false, realtimeData:action.payload.sort((a,b)=>b.price-a.price)}

		case ORDER_BOOK_WS_UPDATE:
			var realtimeData=[...state.realtimeData];
			updateOrderBook(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case ORDER_BOOK_WS_DELETE:
			var realtimeData=[...state.realtimeData];
			deleteOrderBook(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}

		case ORDER_BOOK_WS_INSERT:
			var realtimeData=[...state.realtimeData];
			insertOrderBook(realtimeData,action.payload)
			return {...state,loading:false, realtimeData: realtimeData.sort((a,b)=>b.price-a.price)}
		
		case ORDER_BOOK_WS_FLUSH:
			return {...state, realtimeData:[], data:[]}
		default:
			return state
	}
}