import { USERLOG_GET_STARTED, USERLOG_GET_FINISHED, USERLOG_GET_ERROR} from './UserLog.types.js';

const INIT_STATE={
	loading:false,
	data:[],
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case USERLOG_GET_STARTED:
			return {...state,loading:true, error:null}
		case USERLOG_GET_FINISHED:
			return {...state,loading:false, data:action.payload}
		case USERLOG_GET_ERROR:
			return {...state,loading:false, error:action.payload}
		default:
			return state
	}
}