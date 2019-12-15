import {WEB_SCREEN_OPENED, WEB_SCREEN_CLOSED, WEB_SCREEN_LOADED} from './WebScreen.types.js';

export const close=()=>{
	return ({type:WEB_SCREEN_CLOSED})
}

export const loaded=(syntheticEvent)=>{
	const { nativeEvent } = syntheticEvent;
	return ({type:WEB_SCREEN_LOADED,payload: (nativeEvent.code<0)?nativeEvent.description:null})
}