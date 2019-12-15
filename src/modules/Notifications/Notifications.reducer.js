import {ADD_NOTIFICATION, LOAD_NOTIFICATIONS, CLEAR_NOTIFICATIONS} from './Notifications.types.js'

const INIT_STATE={
	notifications:[]
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case CLEAR_NOTIFICATIONS:
			return {...state, notifications:[]}
		case LOAD_NOTIFICATIONS:
			return {...state, notifications:action.payload}
		case ADD_NOTIFICATION:
			return {...state, notifications:[...state.notifications, action.payload]}
		default:
			return state
	}
}