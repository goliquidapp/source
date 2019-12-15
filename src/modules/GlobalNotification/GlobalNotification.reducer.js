import {NOTIFICATION_SHOW} from './GlobalNotification.types.js';

const INIT={
	title:'',
	body:'',
	image:require('../../resources/icons/icon.png'),
	type:'danger'
}

export default (state=INIT, action)=>{
	switch(action.type){
		case NOTIFICATION_SHOW:
			const {title, body, image, type} = action.payload
			return {...state, title, body, image, type}
		default:
			return state;
	}
}