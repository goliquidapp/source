import {WEB_SCREEN_OPENED, WEB_SCREEN_CLOSED, WEB_SCREEN_LOADED} from './WebScreen.types.js';

const INIT={
	url:'',
	opened:false,
	loading:true,
	error:null
}

export default (state=INIT, action)=>{
	switch(action.type){
		case WEB_SCREEN_OPENED:
			return {...state, opened:true, loading:true, error:null, url:action.payload.url}
		case WEB_SCREEN_CLOSED:
			return {...state, opened:false, url:''}
		case WEB_SCREEN_LOADED:
			return {...state, loading:false, error:action.payload}
		default:
			return state;
	}
}