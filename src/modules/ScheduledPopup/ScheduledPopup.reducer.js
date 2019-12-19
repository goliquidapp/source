import {CLEAR_SCHEDULE, SET_SCHEDULE, SET_COMPONENT} from './ScheduledPopup.types.js'

const INIT_STATE={
	onClose:null,
	children:null,
	schedule:null
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case CLEAR_SCHEDULE:
			return {...state, schedule:null}
		case SET_SCHEDULE:
			const {schedule, children, onClose}=action.payload
			return {...state, schedule, children, onClose}
		case SET_COMPONENT:
			return {...state, children:action.payload}
		default:
			return state
	}
}