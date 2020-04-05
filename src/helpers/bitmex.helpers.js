import AsyncStorage from '@react-native-community/async-storage';
import {HMAC, utils, AES} from "@egendata/react-native-simple-crypto";
import NavigationService from './navigate.js';
import crashlytics from '@react-native-firebase/crashlytics';

import API from '../api/API.js';
import config from '../config.js';
import store from '../redux/store.js';

import {UPDATE_SETTINGS} from '../modules/Settings/Settings.types.js';

import * as Keychain from 'react-native-keychain';

import Theme from '../resources/Theme.js';

import {ASYNC_STORAGE_CRED, 
		KEYCHAIN_KEY, 
		CURRENT_ACCOUNT, 
		ACCOUNTS_META, 
		LIQUID_FIRST_TIME} from './consts.js';

let _navigator;

const BiometryTypes={
	TouchID		:'TouchID',
	FaceID		:'FaceID',
	Fingerprint	:'Fingerprint'
}

const DEFAULT_ACCOUNT_META={
	ID:'primary',
	color:Theme['dark'].highlighted,
	name:'Primary',
	primary:true
}

export const auth=(verb, path, data='', customAuth={appID:null,appSecret:null})=>new Promise(async (resolve,reject)=>{
	try{
		var state=store.getState();
		const {settings}=state;
		if ((settings.appID && settings.appSecret) || (customAuth.appID && customAuth.appSecret)){
			const apiExpires=new Date().getTime()+config.expire;
			const apiKey=customAuth.appID||settings.appID;
			const secret=utils.convertUtf8ToArrayBuffer(customAuth.appSecret||settings.appSecret);
			const payload=utils.convertUtf8ToArrayBuffer(
				verb+config.api+path+(apiExpires).toString()+data
			);
			const signatureArrayBuffer = await HMAC.hmac256(payload, secret);
			const signatureHex = utils.convertArrayBufferToHex(
		  		signatureArrayBuffer
			);
			API.bitmex.defaults.headers.common['api-expires']=apiExpires;
			API.bitmex.defaults.headers.common['api-key']=apiKey;
			API.bitmex.defaults.headers.common['api-signature']=signatureHex;
			resolve({
				'api-expires':apiExpires,
				'api-key':apiKey,
				'api-signature':signatureHex
			})
		}else{
			resolve()
		}
	}catch(err){
		if (config.debug)
			console.log(err)
		reject(err)
	}
})

export const authWSS=(stream)=>new Promise(async (resolve,reject)=>{
	try{
		const verb='GET';
		const path=config.wsPath;
		var state=store.getState();
		const {settings}=state;

		const apiExpires=new Date().getTime()+config.expire;
		const apiKey=settings.appID;
		const secret=utils.convertUtf8ToArrayBuffer(settings.appSecret);
		const payload=utils.convertUtf8ToArrayBuffer(
			verb+path+(apiExpires).toString()
		);

		const signatureArrayBuffer = await HMAC.hmac256(payload, secret);
		const signatureHex = utils.convertArrayBufferToHex(
	  		signatureArrayBuffer
		);

		stream.send(JSON.stringify({"op": "authKeyExpires", "args": [apiKey, apiExpires, signatureHex]}))

		resolve({
			'api-expires':apiExpires,
			'api-key':apiKey,
			'api-signature':signatureHex
		})
	}catch(err){
		if (config.debug)
			console.log(err)
		reject(err)
	}
})

export const flush=()=>new Promise(async (resolve, reject)=>{
    const asyncStorageKeys = await AsyncStorage.getAllKeys();
    if (asyncStorageKeys.length > 0) {
        await AsyncStorage.clear();
    }
    await Keychain.resetGenericPassword({service:KEYCHAIN_KEY+'_'+DEFAULT_ACCOUNT_META.ID});
    resolve();
})

export const checkFirstTime=()=>new Promise(async (resolve, reject)=>{
    const fTime=await AsyncStorage.getItem(LIQUID_FIRST_TIME);
    if (fTime!=='false') resolve(true)
    else resolve(false)
})

export const appAuth=()=>new Promise(async (resolve,reject)=>{
     try{
         const fTime=await checkFirstTime();
         if (fTime) {
             await flush();
             await AsyncStorage.setItem(LIQUID_FIRST_TIME,'false')
             resolve()
         }
         else {
             await getAppAuth();
             resolve()
         }
     }catch(err){
         reject(err)
     }
     
})

export const getAppAuth=()=>new Promise(async (resolve,reject)=>{
	try{
		const ID=await AsyncStorage.getItem(CURRENT_ACCOUNT);

		const credentials = await Keychain.getGenericPassword({service:KEYCHAIN_KEY+'_'+ID});
		var appID, appSecret;
		if (credentials){
            if (credentials.username && credentials.password){
                const cipherB64=await AsyncStorage.getItem(ASYNC_STORAGE_CRED+'_'+ID);
                if (cipherB64){
                    const cipher=utils.convertBase64ToArrayBuffer(cipherB64);
                    const iv  = utils.convertBase64ToArrayBuffer(credentials.username);
                    const key = utils.convertBase64ToArrayBuffer(credentials.password);
                    const data=await AES.decrypt(cipher,key,iv);
                    const newdata=utils.convertArrayBufferToUtf8(data);
                    const appData=JSON.parse(newdata);
                    appID=appData.appID;
                    appSecret=appData.appSecret;
                }
            }else{
                await flush();
                NavigationService.navigate('Auth');
            }
		}else{
			if (config.debug)
				console.log('No credentials stored');
		}

		store.dispatch({
			type:UPDATE_SETTINGS,
			payload:{
				appID,
				appSecret
			}
		})
        if (appID && appSecret) NavigationService.navigate('Home');
		resolve({appID,appSecret})
	}catch(err){
		if (config.debug)
			console.log(err)
        await flush();
		NavigationService.navigate('Auth');
        reject(err);
	}
})

export const saveAppAuth=({appID, appSecret})=>new Promise(async (resolve, reject)=>{
	try{
		const securityLevel=await Keychain.getSecurityLevel();
		var settings={
			accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
			accessible: Keychain.ACCESSIBLE.ALWAYS,
			securityLevel
		}
		if (!appID || !appSecret) {
            await flush();
			store.dispatch({
				type:UPDATE_SETTINGS,
				payload:{
					appID:null,
					appSecret:null
				}
			})
			NavigationService.navigate('Auth');
		}
		else {
			const key = await utils.randomBytes(32);
			const iv  = await utils.randomBytes(16);
			const data=JSON.stringify({appID,appSecret});
			const newdata=utils.convertUtf8ToArrayBuffer(data);
			const cipher=await AES.encrypt(newdata,key,iv);
			const cipherB64=utils.convertArrayBufferToBase64(cipher)
			await AsyncStorage.setItem(ASYNC_STORAGE_CRED+'_'+DEFAULT_ACCOUNT_META.ID,cipherB64)
			await Keychain.setGenericPassword(
				utils.convertArrayBufferToBase64(iv),
				utils.convertArrayBufferToBase64(key),
                {service:KEYCHAIN_KEY+'_'+DEFAULT_ACCOUNT_META.ID}
			);
			store.dispatch({
				type:UPDATE_SETTINGS,
				payload:{
					appID,
					appSecret
				}
			})
			await AsyncStorage.setItem(ACCOUNTS_META,JSON.stringify({accounts:[DEFAULT_ACCOUNT_META]}));
			await AsyncStorage.setItem(CURRENT_ACCOUNT,DEFAULT_ACCOUNT_META.ID);
		}
		resolve({appID,appSecret})
	}catch(err){
		if (config.debug)
			console.log(err)
		reject(err)
	}
})



export const addSecondaryAccount=({appID, appSecret, accountMeta})=>new Promise(async(resolve, reject)=>{
	try{
		const securityLevel=await Keychain.getSecurityLevel();
		var settings={
			accessControl: Keychain.ACCESS_CONTROL.USER_PRESENCE,
			accessible: Keychain.ACCESSIBLE.ALWAYS,
			securityLevel
		}

		if (!appID || !appSecret || !accountMeta) throw(new Error('Not all data are provided.'));
		else {
			const key = await utils.randomBytes(32);
			const iv  = await utils.randomBytes(16);

			const metaID = await utils.randomBytes(16);
			const metaIDB64=utils.convertArrayBufferToBase64(metaID);

			accountMeta.ID=metaIDB64;

			const data=JSON.stringify({appID,appSecret});
			const newdata=utils.convertUtf8ToArrayBuffer(data);
			const cipher=await AES.encrypt(newdata,key,iv);
			const cipherB64=utils.convertArrayBufferToBase64(cipher)
			await AsyncStorage.setItem(ASYNC_STORAGE_CRED+'_'+accountMeta.ID,cipherB64)
			await Keychain.setGenericPassword(
				utils.convertArrayBufferToBase64(iv),
				utils.convertArrayBufferToBase64(key),
                {service:KEYCHAIN_KEY+'_'+accountMeta.ID}
			);

			const {accounts=[]}=JSON.parse(await AsyncStorage.getItem(ACCOUNTS_META));
			await AsyncStorage.setItem(ACCOUNTS_META,JSON.stringify({accounts:[...accounts, accountMeta]}));
		}
		resolve({appID,appSecret})
	}catch(err){
		if (config.debug)
			console.log(err)
		reject(err)
	}
})

export const switchAccount=({ID})=>new Promise(async (resolve, reject)=>{
	try{
		const credentials = await Keychain.getGenericPassword({service:KEYCHAIN_KEY+'_'+ID});
		var appID, appSecret;
		if (credentials){
            if (credentials.username && credentials.password){
                const cipherB64=await AsyncStorage.getItem(ASYNC_STORAGE_CRED+'_'+ID);
                if (cipherB64){
                    const cipher=utils.convertBase64ToArrayBuffer(cipherB64);
                    const iv  = utils.convertBase64ToArrayBuffer(credentials.username);
                    const key = utils.convertBase64ToArrayBuffer(credentials.password);
                    const data=await AES.decrypt(cipher,key,iv);
                    const newdata=utils.convertArrayBufferToUtf8(data);
                    const appData=JSON.parse(newdata);
                    appID=appData.appID;
                    appSecret=appData.appSecret;
					if (appID && appSecret) {
						await AsyncStorage.setItem(CURRENT_ACCOUNT,ID);
	                    store.dispatch({
							type:UPDATE_SETTINGS,
							payload:{
								appID,
								appSecret
							}
						})
						API.wsConnect.restart();
					}
                }
            }else{
                throw(new Error('Account not found'));
            }
		}else{
			throw(new Error('Account not found'));
		}
		resolve({appID,appSecret})
	}catch(err){
		if (config.debug)
			console.log(err)
        reject(err);
	}
})

export const validateCredentials=({appID, appSecret})=>new Promise(async (resolve, reject)=>{
	try{
		const params='';
		await auth('GET','/user'+params,'',{appID, appSecret});
		var response=await API.bitmex.get('/user'+params);
		resolve(true)
	}catch(err){
		if (config.debug)
			console.log(err)
		resolve(false)
	}
})


export const removeAccount=({ID})=>new Promise(async (resolve, reject)=>{
	try{
		const key = await AsyncStorage.getItem(ASYNC_STORAGE_CRED+'_'+ID);
	    if (key) {
	        await AsyncStorage.removeItem(key);
	    }
	    const {accounts=[]}=JSON.parse(await AsyncStorage.getItem(ACCOUNTS_META));
	    accounts.map((account,index)=>{
	    	if (account.ID===ID)
	    		accounts.splice(index,1)
	    })
		await AsyncStorage.setItem(ACCOUNTS_META,JSON.stringify({accounts:[...accounts]}));
	    await Keychain.resetGenericPassword({service:KEYCHAIN_KEY+'_'+ID});
	    resolve();
	}catch(err){
		if (config.debug)
			console.log(err)
		resolve(false)
	}
	
})