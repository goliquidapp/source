import axios from 'axios';
import config from '../config';

import {authWSS} from '../helpers/bitmex.helpers.js';
import {batch} from 'react-redux';
import {notify} from '../helpers/notifications.js';
import store from '../redux/store.js';

import retryInterceptor from 'axios-retry-interceptor';

/**
	WebSocket causes high frequent updates of Store causing component
	to render in alot, we use "batch" to update the component only after
	BUFFERSIZE amount of changes.
*/
const BUFFERSIZE = config.debug ? 1 : 1;
const UI_IMPROVMENTS = true;
const REAL_TIME_PRECESSION = 200; //ms

class wsConnect {
	constructor() {
		this.connections = {};
		this.initConnections();
	}
	initConnections = () => {
		this.webSocket = new WebSocket(config.ws);

		this.timer = setInterval(
			() => this.checkConnections(),
			config.WSReconnectTimeout,
		);

		this.webSocket.onopen = () => {
			var connections = Object.keys(this.connections);
			connections.map(async connectionName => {
				var {buffer, bufferSize, handleMessage, args, auth} = this.connections[
					connectionName
				];
				if (auth) await authWSS(this.webSocket);

				this.webSocket.send(JSON.stringify({op: 'subscribe', args: [...args]}));
			});
			this.webSocket.onmessage = e => {
				this.handleMessage(e);
			};
		};

		this.batchInterval = setInterval(this.handleBatches, REAL_TIME_PRECESSION);
	};
	handleBatches = () => {
		if (UI_IMPROVMENTS) {
			var connections = Object.keys(this.connections);
			connections.map(connectionName => {
				var {buffer, handleMessage} = this.connections[connectionName];
				batch(() => {
					buffer.map(data => {
						handleMessage(data);
					});
				});
				this.connections[connectionName].buffer = [];
			});
		}
	};
	handleMessage = e => {
		var connections = Object.keys(this.connections);
		connections.map(connectionName => {
			var {buffer, bufferSize, handleMessage} = this.connections[
				connectionName
			];
			const {table} = JSON.parse(e.data);
			if (table === connectionName) {
				buffer.push(e);
				if (!UI_IMPROVMENTS) handleMessage(data);
			}
		});
	};
	checkConnections = () => {
		var connections = Object.keys(this.connections);
		if (connections.length > 0) {
			if (this.webSocket.readyState !== WebSocket.OPEN) {
				notify(
					{
						title: 'Network Status',
						body: 'Websocket is closed, trying to reconnect!',
						type: 'danger',
					},
					false,
				);
				if (config.debug) {
					console.log(`Connection is closed`);
				}
				this.webSocket = new WebSocket(config.ws);
				this.webSocket.onopen = () => {
					connections.map(async connectionName => {
						var {
							buffer,
							bufferSize,
							handleMessage,
							args,
							auth,
						} = this.connections[connectionName];
						if (auth) await authWSS(this.webSocket);

						this.webSocket.send(
							JSON.stringify({op: 'subscribe', args: [...args]}),
						);
					});
					notify(
						{
							title: 'Network Status',
							body: 'Websocket is connected!',
							type: 'success',
						},
						false,
					);
					this.webSocket.onmessage = e => {
						this.handleMessage(e);
					};
				};
			}
		}
	};
	async connect(
		connectionName,
		args,
		handleMessage,
		auth = false,
		size = BUFFERSIZE,
	) {
		var state = store.getState();
		const {settings} = state;
		var authenticated = false;
		if (settings.appID && settings.appSecret) authenticated = true;

		if (!authenticated && auth) return false;

		if (Object.keys(this.connections).indexOf(connectionName) >= 0) {
			if (config.debug) {
				console.log(`Connection ${connectionName} already registered`);
			}
			return true;
		}

		this.connections[connectionName] = {
			buffer: [],
			bufferSize: size,
			args,
			auth,
			handleMessage,
		};

		if (this.webSocket.readyState === WebSocket.OPEN) {
			if (auth) await authWSS(this.webSocket);

			this.webSocket.send(JSON.stringify({op: 'subscribe', args: [...args]}));
		}

		return false;
	}
	async disconnect(connectionName, args, auth = false) {
		var state = store.getState();
		const {settings} = state;
		var authenticated = false;
		if (settings.appID && settings.appSecret) authenticated = true;

		if (!authenticated && auth) return false;

		if (Object.keys(this.connections).indexOf(connectionName) >= 0) {
			delete this.connections[connectionName];
			if (this.webSocket.readyState === WebSocket.OPEN) {
				if (auth) await authWSS(this.webSocket);

				this.webSocket.send(
					JSON.stringify({op: 'unsubscribe', args: [...args]}),
				);
			}
			return true;
		} else {
			if (config.debug) {
				console.log(`Connection ${connectionName} not registered`);
			}
			return true;
		}

		return false;
	}
	clean = () => {
		if (this.timer) clearInterval(this.timer);
		if (this.batchInterval) clearInterval(this.batchInterval);
		this.webSocket.close();
	};
	restart = () => {
		this.clean();
		this.initConnections();
	};
}

let wsconnect = new wsConnect();


// HTTP error codes that will be retried when failing
const retryCodes=[[500,599]]
const maxRetry=50;
const axiosClient = axios.create({
	baseURL: config.baseURL,
	headers: {
		'Content-Type': 'application/json',
	},
});


const sleepRequest = (milliseconds, originalRequest) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(axiosClient(originalRequest)), milliseconds);
    });
};

axiosClient.interceptors.response.use(response => {
    return response;
}, error => {
    const { config, response: { status }} = error;

    if (axiosClient.defaults.headers.common['retry']) {
    	axiosClient.defaults.headers.common['retry']+=1;
    }
    else {
    	axiosClient.defaults.headers.common['retry']=1;
    }

    let retryCount=axiosClient.defaults.headers.common['retry'];

    let retry=false;
    retryCodes.map((rc)=>{
    	if (status>=rc[0] && status<=rc[1])
    		retry=true;
    })

    if (retry && retryCount<maxRetry) {
        return sleepRequest(1000, config);
    } else {
        return Promise.reject(error);
    }
});


export default {
	bitmex: axiosClient,
	wsConnect: wsconnect,
};
