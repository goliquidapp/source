import {CLEAR_SCHEDULE, SET_SCHEDULE, SET_COMPONENT, SET_SHOW} from './ScheduledPopup.types.js'

const INIT_STATE={
	onClose:null,
	children:null,
	schedule:null,
	show:false
}

export default (state=INIT_STATE,action)=>{
	switch(action.type){
		case CLEAR_SCHEDULE:
			return {...state, schedule:null, show:false}
		case SET_SCHEDULE:
			const {schedule, children, onClose}=action.payload
			return {...state, schedule, children, onClose}
		case SET_COMPONENT:
			return {...state, children:action.payload}
		case SET_SHOW:
			return {...state,
				show:action.payload.show,
				children:action.payload.children,
				onClose:action.payload.onClose
			}
		default:
			return state
	}
}