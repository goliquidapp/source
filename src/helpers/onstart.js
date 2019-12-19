import React from 'react';
import store from '../redux/store.js';
import myOrders from '../modules/MyOrders/MyOrders.actions.js';
import {setDeadMan} from '../modules/Settings/Settings.actions.js';
import {notify} from './notifications.js';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import {LOAD_NOTIFICATIONS} from '../modules/Notifications/Notifications.types.js'
import AsyncStorage from '@react-native-community/async-storage';

import RateApp from '../components/RateApp/RateApp.component.js';

import moment from 'moment';
import config from '../config.js';
import {schedulePopup} from './notifications.js';

export const start=(tasks)=>{
	tasks.map((task)=>{
		task();
	})
}

export const orders=()=>{
	myOrders.getMyOrders()(store.dispatch)
	myOrders.subscribe()(store.dispatch)
}


export const deadman=()=>{
	var state=store.getState();
	const {settings}=state;
	const {enableDeadMan, deadManTimeout, deadManInterval}=settings;
	if (enableDeadMan){
		setDeadMan(deadManTimeout, deadManInterval)(store.dispatch);
		notify({
			title:'Dead-Man Enabled',
			body:`Dead-Man is enabled for ${deadManTimeout}(sec) timeout and ${deadManInterval}(sec) interval`,
			type:'info'
		})
	}else{
		setDeadMan(0, null)(store.dispatch);
	}
	
}
export const notificationsPermissions=async ()=>{
    if (!messaging().isRegisteredForRemoteNotifications) {
        await messaging().registerForRemoteNotifications();
    }
    const permissionGranted = await messaging().requestPermission();
    
    messaging().onMessage((remoteMessage)=>{
		let notif=PushNotification.localNotification({
            title:remoteMessage.data.title,
            message:remoteMessage.data.body
        });
    })

    PushNotification.configure({
       requestPermissions: true,
       onNotification: (notification)=>{
       		if (PushNotificationIOS){
       			notification.finish(PushNotificationIOS.FetchResult.NoData);
       		}
       }
   })
}

export const updateSubscriptions=()=>{
    var state=store.getState();
    const {settings}=state;
    const {channels}=settings;
    
    channels.map(async (channel)=>{
         try{
             if (channel.enabled){
                 var response=await messaging().subscribeToTopic(channel.label);
             }
         }catch(err){
                 if (config.debug)
                    console.log(err);
         }
    })
}


export const loadNotifications=async ()=>{
  const data = await AsyncStorage.getItem('notifications');
  if (data){
    const notifications=JSON.parse(data).notifications;
    store.dispatch({
      type:LOAD_NOTIFICATIONS,
      payload:notifications
    });
  }
}

export const rateApp=async ()=>{
  const rateInfo = await AsyncStorage.getItem('appRated');

  if (!rateInfo){
    const rateDate=moment(moment()).add(config.rateSchedule.duration,config.rateSchedule.unit);
    schedulePopup(rateDate, <RateApp/>);

    await AsyncStorage.setItem('appRated', JSON.stringify({rated:false, rateDate}));
  }else if (rateInfo){
    const rated=JSON.parse(rateInfo).rated;
    if (!rated){
      const rateDate=moment(moment()).add(config.rateReminder.duration,config.rateReminder.unit);
      schedulePopup(rateDate, <RateApp/>);

      await AsyncStorage.setItem('appRated', JSON.stringify({rated:false, rateDate}));
    }
  }
}