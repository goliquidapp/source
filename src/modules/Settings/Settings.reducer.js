import { UPDATE_SETTINGS,
		 SET_DEADMAN_INTERVAL,
		 CLEAR_DEADMAN_INTERVAL,
		 SET_VALID_AUTH,
		 START_VALID_AUTH,
		 SET_VALID_ERROR } from './Settings.types.js';

import config from '../../config.js';

let channels=[
	{name:'Bitmex',label:'Bitmex',enabled:true, type:'High Trades'},
	{name:'Bitfinex',label:'Bitfinex',enabled:true, type:'High Trades'},
	{name:'Binance',label:'Binance',enabled:true, type:'High Trades'},
	{name:'Bitstamp',label:'Bitstamp',enabled:true, type:'High Trades'},
	{name:'Bitcoin',label:'BTC', enabled:true, type:'Publications'},
	{name:'Ethereum',label:'ETH', enabled:false, type:'Publications'},
	{name:'XRP',label:'XRP', enabled:false, type:'Publications'},
	{name:'Bitcoin Cash',label:'BCH', enabled:false, type:'Publications'},
	{name:'LiteCoin',label:'LTC', enabled:false, type:'Publications'},
	{name:'EOS',label:'EOS', enabled:false, type:'Publications'},
	{name:'Binance Coin',label:'BNB', enabled:false, type:'Publications'},
	{name:'Stellar',label:'XLM', enabled:false, type:'Publications'},
	{name:'Cardano',label:'ADA', enabled:false, type:'Publications'},
	{name:'TRON',label:'TRX', enabled:false, type:'Publications'},
	{name:'Monero',label:'XMR', enabled:false, type:'Publications'},
	{name:'Dash',label:'DASH', enabled:false, type:'Publications'},
	{name:'Bitcoin SV',label:'BSV', enabled:false, type:'Publications'},
	{name:'Tezos',label:'XTZ', enabled:false, type:'Publications'},
	{name:'Ethereum Classic',label:'ETC', enabled:false, type:'Publications'},
	{name:'Neo',label:'NEO', enabled:false, type:'Publications'},
	{name:'Maker',label:'MKR', enabled:false, type:'Publications'},
	{name:'Ontology',label:'ONT', enabled:false, type:'Publications'}
]

channels=(config.debugChannel||config.debug)?[...channels, {name:'Debug',label:'Debug', enabled:true, type:'High Trades'}]:channels;

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
	channels,
	currency:{
		symbol:'XBT',
		symbolFull:'XBTUSD',
		orders:'USD',
		currencySign:'$'
	},
	notificationsSettings:{
		publicationNotifications:true,
		highOrdersNotifications:true
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
