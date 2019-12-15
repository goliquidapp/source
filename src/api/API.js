import axios from 'axios';
import config from '../config';

import {authWSS} from '../helpers/bitmex.helpers.js';
import { batch } from "react-redux";
import {notify} from '../helpers/notifications.js';
import store from '../redux/store.js';

/**
	WebSocket causes high frequent updates of Store causing component
	to render in alot, we use "batch" to update the component only after
	BUFFERSIZE amount of changes.
*/
const BUFFERSIZE=config.debug?1:1

class wsConnect{
	constructor(){
		this.connections={};
		this.webSocket=new WebSocket(config.ws);

		this.timer=setInterval(
			()=>this.checkConnections(),
			config.WSReconnectTimeout
		)

		this.webSocket.onopen=()=>{
			var connections=Object.keys(this.connections);
			connections.map(async (connectionName)=>{
				var {buffer, bufferSize, handleMessage, args, auth}=this.connections[connectionName];
				if (auth) await authWSS(this.webSocket);
				
				this.webSocket.send(JSON.stringify(
					{"op": "subscribe", "args": [...args]}
				));
			})
			this.webSocket.onmessage=(e)=>{
				this.handleMessage(e)
			}
		}
	}
	handleMessage=(e)=>{
		var connections=Object.keys(this.connections);
		connections.map((connectionName)=>{
			var {buffer, bufferSize, handleMessage}=this.connections[connectionName];
			const {table}=JSON.parse(e.data)
			if (table===connectionName){
				buffer.push(e);
				if (buffer.length>bufferSize){
					batch(() => {
			        	buffer.map((data)=>{
			        		handleMessage(data)
			        	})
			        	buffer.length=0;
			        })
				}
			}
		})
	}
	checkConnections=()=>{
		var connections=Object.keys(this.connections);
		if (connections.length>0){
			if ((this.webSocket.readyState !== WebSocket.OPEN)){
				notify({title:'Network Issue',body:'Websocket is closed, trying to reconnect!',type:'danger'}, false)
				if (config.debug){
					console.log(`Connection is closed`)
				}
				this.webSocket=new WebSocket(config.ws);
				this.webSocket.onopen=()=>{
					connections.map(async (connectionName)=>{
						var {buffer, bufferSize, handleMessage, args, auth}=this.connections[connectionName];
						if (auth) await authWSS(this.webSocket);
						
						this.webSocket.send(JSON.stringify(
							{"op": "subscribe", "args": [...args]}
						));
					})
					notify({title:'Network Issue',body:'Websocket is connected!',type:'success'}, false)
					this.webSocket.onmessage=(e)=>{
						this.handleMessage(e)
					}
				}
			}
		}
	}
	async connect(connectionName, args, handleMessage, auth=false, size=BUFFERSIZE){
		var state=store.getState();
		const {settings}=state;
		var authenticated=false;
		if (settings.appID && settings.appSecret) authenticated=true;

		if (!authenticated && auth) return false;

		if (Object.keys(this.connections).indexOf(connectionName)>=0) {
			if (config.debug){
				console.log(`Connection ${connectionName} already registered`)
			}
			return true
		};

		this.connections[connectionName]={buffer:[], bufferSize:size, args, auth, handleMessage};

		if ((this.webSocket.readyState === WebSocket.OPEN)){
			if (auth) await authWSS(this.webSocket);

			this.webSocket.send(JSON.stringify(
				{"op": "subscribe", "args": [...args]}
			));
		}
		
		return false
	}
	async disconnect(connectionName, args, auth=false){
		var state=store.getState();
		const {settings}=state;
		var authenticated=false;
		if (settings.appID && settings.appSecret) authenticated=true;

		if (!authenticated && auth) return false;

		if (Object.keys(this.connections).indexOf(connectionName)>=0) {
			delete this.connections[connectionName];
			if ((this.webSocket.readyState === WebSocket.OPEN)){
				if (auth) await authWSS(this.webSocket);

				this.webSocket.send(JSON.stringify(
					{"op": "unsubscribe", "args": [...args]}
				));
			}
			return true
		}else{
			if (config.debug){
				console.log(`Connection ${connectionName} not registered`)
			}
			return true
		}
		
		return false
	}
	clean=()=>{
		if (this.timer) clearInterval(this.timer);
		this.webSocket.close();
	}
}

let wsconnect= new wsConnect()

export default {
	bitmex:axios.create({
		baseURL: config.baseURL,
		headers: {
			'Content-Type': 'application/json'
		}
	}),
	wsConnect: wsconnect
}
