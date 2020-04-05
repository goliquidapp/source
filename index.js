/**
 * @format
 */

import {AppRegistry, DeviceEventEmitter, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import App from './src/App';
import {name as appName} from './app.json';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';

import {setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import BackgroundFetch from "react-native-background-fetch";

import {headlessObserve, prices, liquidation, deadmanBackground} from './src/helpers/watchdog.js';
import {openExtURL} from './src/helpers/text.js';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import moment from 'moment';
import {CURRENT_ACCOUNT} from './src/helpers/consts.js';

const isIOS=Platform.OS==='ios';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	const {title, body, data}=remoteMessage.data;
    let notif={
      title: remoteMessage.data.title,
      message: remoteMessage.data.body,
      data: remoteMessage.data.data,
      body: remoteMessage.data.body,
      priority: "high",
      playSound: true,
      soundName: 'default'
    }
    notif['actions']=data?'["Open Link"]':'';
    PushNotification.localNotification(notif);

	const time=moment().format('lll');
	const type='info';
	const notificationData=remoteMessage.data;
	if (typeof(notificationData.data)==='string'){
		notificationData.data=JSON.parse(notificationData.data);
	}
	const _id=remoteMessage.data._id;

	const ID=await AsyncStorage.getItem(CURRENT_ACCOUNT);
	const cache = await AsyncStorage.getItem('notifications'+'_'+ID);
	var notifications=[];
	if (cache)
		notifications=JSON.parse(cache).notifications;
	notifications.push({title,body,type, _id, time, notificationData});
	await AsyncStorage.setItem('notifications'+'_'+ID,JSON.stringify({notifications}));
});

PushNotification.registerNotificationActions(['Open Link']);
DeviceEventEmitter.addListener('notificationActionReceived',(e)=>{
	const info = JSON.parse(e.dataJSON);
	switch(info.action){
		case 'Open Link':
			openExtURL(e.data.link);
		default:
			return;
	}
})

setJSExceptionHandler((error,isFatal)=>{
	crashlytics().recordError(new Error(error));
},allowInDevMode=false)

setNativeExceptionHandler((error)=>{
	crashlytics().recordError(new Error(error));
},forceAppQuit=true,executeDefaultHandler=true);

BackgroundFetch.registerHeadlessTask(()=>headlessObserve([prices, liquidation, deadmanBackground]));
AppRegistry.registerComponent(appName, () => App);
