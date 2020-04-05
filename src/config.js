import {Platform} from 'react-native';

const debug=true;
const debugChannel=true;

const startDate=(new Date('2020-02-16T06:00:00.000Z')).getTime();
const now=(new Date()).getTime();
const diff=(startDate-now)

export default {
	ID:"",
	SECRET:"",
	baseURL:debug?"https://testnet.bitmex.com/api/v1":"https://www.bitmex.com/api/v1",
	host:debug?"https://testnet.bitmex.com":'https://www.bitmex.com',
	api:'/api/v1',
	expire: 1000*60*60,
	debug,
    debugChannel,
	ws:debug?'wss://testnet.bitmex.com/realtime':'wss://www.bitmex.com/realtime',
	wsHost:debug?'wss://testnet.bitmex.com':'wss://www.bitmex.com',
	wsPath:'/realtime',
	retryTimeout:15000,
	WSReconnectTimeout:5000,
    testFlight:true,
    liteApp:false,
    rateSchedule:{duration:3, unit:'minutes'},
    rateReminder:{duration:2, unit:'minutes'},
    packageName:Platform.OS==='android'?'com.bitmex_trading':'1482273711',
    wavesSpeedParam:500000,
    BITCOIN_ADDR:"1B3BwuWSdfLoDY8kKfQV5bxLneUMjrhjDX",
    ETH_ADDR:"0xd600a64a405BFaD367cc9B55B97A5568Fb03f757"
}
