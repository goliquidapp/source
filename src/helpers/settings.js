import AsyncStorage from '@react-native-community/async-storage';

import API from '../api/API.js';
import config from '../config.js';
import store from '../redux/store.js';

import {UPDATE_SETTINGS} from '../modules/Settings/Settings.types.js';

export const loadSettings=()=>new Promise(async (resolve,reject)=>{
	try{
		const settings=await AsyncStorage.getItem('Settings');
    if (settings){
      const data=JSON.parse(settings);
      store.dispatch({
        type:UPDATE_SETTINGS,
        payload:{...data}
      })
      resolve(data)
    }else resolve(false)
		
	}catch(err){
      if (config.debug){
          console.log(err);
      }
      reject(err)
	}
})
