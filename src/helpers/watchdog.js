import AsyncStorage from '@react-native-community/async-storage';
import BackgroundFetch from "react-native-background-fetch";

import {getAppAuth} from './bitmex.helpers.js';
import {loadSettings} from './settings.js';
import {auth} from './bitmex.helpers.js';
import {notify} from './notifications.js';
import API from '../api/API.js';
import config from '../config.js';
import {orderBook} from './finance.js';
import store from '../redux/store.js';

import {setDeadMan} from '../modules/Settings/Settings.actions.js';

export const headlessObserve=async (tasks)=>{
	try{
		await getAppAuth();
	    await loadSettings();
	    tasks.map(async (task)=>{
			await task();
		})
		BackgroundFetch.finish();
	}catch(err){
		if (config.debug)
			console.log(err)
		BackgroundFetch.finish();
	}
}

export const observe=(tasks)=>{
	var state=store.getState();
	const {settings}=state;
	tasks.map((task)=>{
		setInterval(async()=>{await task()},1000*60*settings.intervalDuration)
	})
	BackgroundFetch.configure({
		minimumFetchInterval: 15, // minimum is 15 mins
		stopOnTerminate: false,
		startOnBoot: true,
		forceReload: false,
		enableHeadless: true,
		requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
	},async ()=>{
		await getAppAuth();
        await loadSettings();
		tasks.map(async (task)=>{
			await task();
		})
		BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
	},(err)=>{
		if (config.debug){
			console.log(err);
		}
	})
}

export const getLastReading=()=>new Promise(async (resolve, reject)=>{
	const value = await AsyncStorage.getItem('lastReading');
	if (!value) resolve({buy:0,sell:0})
	else resolve(JSON.parse(value));
})


export const setLastReading=(data)=>new Promise(async (resolve, reject)=>{
	await AsyncStorage.setItem('lastReading',JSON.stringify(data));
	resolve();
})

export const prices=()=>new Promise(async (resolve, reject)=>{
	var state=store.getState();
	const {settings}=state;
	const currency=settings.currency;
	
	try{
		const params=`?symbol=${currency.symbolFull}&depth=25`;
		await auth('GET','/orderBook/L2'+params);
		var response=await API.bitmex.get('/orderBook/L2'+params);
		const data=orderBook(response.data);

		const currentReading={
			buy  : data.buy.max,
			sell : data.sell.min
		}

		const lastReading=await getLastReading();
		if (lastReading.buy===0 || lastReading.sell===0){
			await setLastReading(currentReading);
			resolve()
		}else{
			await setLastReading(currentReading);

			const threshold={
				buy  : lastReading.buy*(settings.pricesChangeThreshold/100.0),
				sell : lastReading.sell*(settings.pricesChangeThreshold/100.0)
			}

			if (Math.abs(currentReading.sell-lastReading.sell)>threshold.sell){
				if ((currentReading.sell-lastReading.sell)>0){
					notify({title:"Sell price increased",body:lastReading.sell+' → '+currentReading.sell, type:'info'});
				}else{
					notify({title:"Sell price decreased",body:lastReading.sell+' → '+currentReading.sell, type:'info'});
				}
			}
			if (Math.abs(currentReading.buy-lastReading.buy)>threshold.buy){
				if ((currentReading.buy-lastReading.buy)>0){
					notify({title:"Buy price increased",body:lastReading.buy+' → '+currentReading.buy, type:'info'});
				}else{
					notify({title:"Buy price decreased",body:lastReading.buy+' → '+currentReading.buy, type:'info'});
				}
			}
			resolve()
		}
		
	}catch(err){
		if (config.debug)
			console.log(err)
		resolve()
	}
})

export const liquidation=()=>new Promise(async (resolve, reject)=>{
	var state=store.getState();
	const {settings}=state;
	try{
		const params='';
		await auth('GET','/position'+params);
		var response=await API.bitmex.get('/position'+params);
		if (response.data[0]){
			if (response.data[0].isOpen){
				const {markPrice, liquidationPrice}=response.data[0];
				const threshold=liquidationPrice*(settings.liquidationThreshold/100.0);

				if (Math.abs(markPrice - liquidationPrice)<=threshold){
					var type='warning';
					if (Math.abs(markPrice - liquidationPrice)<=(threshold/2)) type='danger'
					notify({
						title:"Liquidation warning",
						body:"Liquidation price: "+liquidationPrice+", Market Price: "+markPrice,
						type
					});
				}
			}
		}
		resolve()

	}catch(err){
		if (config.debug)
			console.log(err)
		resolve()
	}
})



export const deadmanBackground=()=>new Promise(async (resolve, reject)=>{
	var state=store.getState();
	const {settings}=state;
	const {enableDeadMan, deadManTimeout}=settings;
	if (enableDeadMan){
		const params='';
		const data={
			timeout:deadManTimeout*1000
		}
		await auth('POST','/order/cancelAllAfter',JSON.stringify(data));
		var response=await API.bitmex.post('/order/cancelAllAfter',data);
	}
	resolve()
})