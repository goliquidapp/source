import { UPDATE_SETTINGS,
		 SET_DEADMAN_INTERVAL,
		 CLEAR_DEADMAN_INTERVAL,
		 SET_VALID_AUTH,
		 START_VALID_AUTH,
		 SET_VALID_ERROR } from './Settings.types.js';

const INIT={
	appID:null,
	appSecret:null,
	validAuth:false,
	showInAppNotifications:true,
	allowNotifications:true,
	intervalDuration:1,
	pricesChangeThreshold:2,
	liquidationThreshold:2,
	enableDeadMan:false,
	deadManTimeout:60,
	deadManInterval:15,
	interval:null,
	channels:[
		{label:'Bitmex',enabled:true},
		{label:'Bitfinex',enabled:false},
		{label:'Binance',enabled:false},
		{label:'Bitstamp',enabled:false}
	],
	currency:{
		symbol:'XBT',
		symbolFull:'XBTUSD',
		orders:'USD',
		currencySign:'$'
	},
	loading:false,
	error:null
}

export default (state=INIT, action)=>{
	switch (action.type){
		case UPDATE_SETTINGS:
			return {...state,...action.payload}
		case CLEAR_DEADMAN_INTERVAL:
			if(state.interval)
				if (state.interval.clearInterval)
					state.interval.clearInterval();
			return {...state, interval: null}
		case SET_DEADMAN_INTERVAL:
			return {...state, interval: action.payload}
		case START_VALID_AUTH:
			return {...state, loading:true, error:null}
		case SET_VALID_AUTH:
			return {...state, validAuth: true, error:null, loading:false}
		case SET_VALID_ERROR:
			return {...state, validAuth:false, error: action.payload, loading:false}
		default:
			return state;
	}
}