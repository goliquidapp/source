import { SUMMARY_GET_STARTED, SUMMARY_GET_FINISHED, SUMMARY_GET_ERROR} from './Summary.types.js';

const INIT_STATE={
	loading:false,
	data:{buy:{price:0},sell:{price:0}},
	error:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case SUMMARY_GET_STARTED:
			return {...state,loading:true, error:null}
		case SUMMARY_GET_FINISHED:
			return {...state,loading:false, data:action.payload}
		case SUMMARY_GET_ERROR:
			return {...state,loading:false, error:action.payload}
		default:
			return state
	}
}