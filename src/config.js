const debug=false;

export default {
	ID:"",
	SECRET:"",
	baseURL:debug?"https://testnet.bitmex.com/api/v1":"https://www.bitmex.com/api/v1",
	host:debug?"https://testnet.bitmex.com":'https://www.bitmex.com',
	api:'/api/v1',
	expire: 1000*60*60,
	debug,
	ws:debug?'wss://testnet.bitmex.com/realtime':'wss://www.bitmex.com/realtime',
	wsHost:debug?'wss://testnet.bitmex.com':'wss://www.bitmex.com',
	wsPath:'/realtime',
	retryTimeout:15000,
	WSReconnectTimeout:5000,
    testFlight:true,
    liteApp:false
}
