import React from 'react';
import {Platform, DeviceEventEmitter} from 'react-native';
import store from '../redux/store.js';
import myOrders from '../modules/MyOrders/MyOrders.actions.js';
import {setDeadMan} from '../modules/Settings/Settings.actions.js';
import {notify} from './notifications.js';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {LOAD_NOTIFICATIONS} from '../modules/Notifications/Notifications.types.js';
import AsyncStorage from '@react-native-community/async-storage';

import RateApp from '../components/RateApp/RateApp.component.js';
import PopupPublication from '../components/PopupPublication/PopupPublication.component.js';

import moment from 'moment';
import config from '../config.js';
import {openExtURL} from './text.js';

import {
  schedulePopup,
  displayPopup,
  cacheNotification,
} from './notifications.js';

import {CURRENT_ACCOUNT} from './consts.js';

const isIOS = Platform.OS === 'ios';

export const start = tasks => {
  tasks.map(task => {
    task();
  });
};

export const orders = () => {
  myOrders.getMyOrders()(store.dispatch);
  myOrders.subscribe()(store.dispatch);
};

export const deadman = () => {
  var state = store.getState();
  const {settings} = state;
  const {enableDeadMan, deadManTimeout, deadManInterval} = settings;
  if (enableDeadMan) {
    setDeadMan(deadManTimeout, deadManInterval)(store.dispatch);
    notify({
      title: 'Dead-Man Enabled',
      body: `Dead-Man is enabled for ${deadManTimeout}(sec) timeout and ${deadManInterval}(sec) interval`,
      type: 'info',
    });
  } else {
    setDeadMan(0, null)(store.dispatch);
  }
};

export const notificationsPermissions = async () => {
  if (!messaging().isRegisteredForRemoteNotifications) {
    await messaging().registerForRemoteNotifications();
  }
  const permissionGranted = await messaging().requestPermission();

  messaging().onMessage(async remoteMessage => {
    if (remoteMessage.from.indexOf('_ios')>=0) return; // don't handle ios channels Push Notification at all!! leave it to the OS
    const {title, body, data} = remoteMessage.data;
    if (!isIOS){
      let notif = {
        title: remoteMessage.data.title,
        message: remoteMessage.data.body,
        data: remoteMessage.data.data,
        body: remoteMessage.data.body,
        priority: 'high',
        playSound: true,
        soundName: 'default',
      };
      notif['actions'] = data ? '["Open Link"]' : '';
      PushNotification.localNotification(notif);
    }

    const _id=remoteMessage.data._id;
    if (data) {
      remoteMessage.data.data = JSON.parse(remoteMessage.data.data);
      cacheNotification({title, body, type: 'info', _id}, remoteMessage.data);
    } else {
      cacheNotification({title, body, type: 'info', _id});
    }
  });

  PushNotification.popInitialNotification(notification => {
  	if (isIOS){
  		const {title, body, data}=notification;
  		if (data.data){
  			notification.data.data=JSON.parse(notification.data.data);
  			displayPopup(<PopupPublication content={notification.data}/>);
  			cacheNotification({title,body,type:'info', _id:notification.data._id}, notification.data);
  		}else{
  			cacheNotification({title,body,type:'info', _id:notification.data._id});
  		}
  	}else{
  		const {title, body} = notification;
	    if (notification.action) {
	      openExtURL(notification.data.link);
	    } else if (notification.userInteraction) {
	      if (notification.data) {
	        notification.data = JSON.parse(notification.data);
	        displayPopup(<PopupPublication content={notification} />);
	      }
	    }
  	}
  	if (PushNotificationIOS) {
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    }
  });

  PushNotification.configure({
    requestPermissions: true,
    popInitialNotification: true,
    onNotification: notification => {
      if (isIOS){
      	if (notification.data){
          const {title, body}=notification.alert;
          if (typeof(notification.data)==='object' && notification.data.data){
             if (typeof(notification.data.data)==='string') notification.data=JSON.parse(notification.data.data)
          }
      		notification.title=title;
          notification.body=body;
          cacheNotification({title,body,type:'info', _id: notification.data._id}, notification);
        	displayPopup(<PopupPublication content={notification}/>);
	     	}
	     	else{
	     		cacheNotification({title,body,type:'info', _id: notification.data._id})
	     	}
      }else {
      	if (notification.action) {
	        openExtURL(notification.data.link);
	      } else if (notification.userInteraction || isIOS) {
	        if (notification.data) {
	          if (isIOS){
	            const notifications=store.getState().notifications.notifications;
	            const notificationData=notifications.find(item=>item._id===notification.data._id);
	            if (notificationData) displayPopup(<PopupPublication content={notificationData} />);
	          }else{
	            displayPopup(<PopupPublication content={notification} />);
	          }
	        }
	      }
      }
      if (PushNotificationIOS) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },
  });
};

export const updateSubscriptions = () => {
  var state = store.getState();
  const {settings} = state;
  const {channels} = settings;

  channels.map(async channel => {
    try {
      if (channel.enabled) {
        if (
          channel.type === 'Publications' &&
          settings.notificationsSettings.publicationNotifications
        ){
          if (isIOS) await messaging().subscribeToTopic(channel.label+'_ios');
          else await messaging().subscribeToTopic(channel.label);
        }
        if (
          channel.type === 'High Trades' &&
          settings.notificationsSettings.highOrdersNotifications
        ){
          if (isIOS) await messaging().subscribeToTopic(channel.label+'_ios');
          else await messaging().subscribeToTopic(channel.label);
        }
      }
    } catch (err) {
      if (config.debug) console.log(err);
    }
  });
};

export const loadNotifications = async () => {
  const ID = await AsyncStorage.getItem(CURRENT_ACCOUNT);
  const data = await AsyncStorage.getItem('notifications' + '_' + ID);
  if (data) {
    const notifications = JSON.parse(data).notifications;
    store.dispatch({
      type: LOAD_NOTIFICATIONS,
      payload: notifications,
    });
  } else {
    store.dispatch({
      type: LOAD_NOTIFICATIONS,
      payload: [],
    });
  }
};

export const rateApp = async () => {
  const rateInfo = await AsyncStorage.getItem('appRated');

  if (!rateInfo) {
    const rateDate = moment(moment()).add(
      config.rateSchedule.duration,
      config.rateSchedule.unit,
    );
    schedulePopup(rateDate, <RateApp />);

    await AsyncStorage.setItem(
      'appRated',
      JSON.stringify({rated: false, rateDate}),
    );
  } else if (rateInfo) {
    const rated = JSON.parse(rateInfo).rated;
    if (!rated) {
      const rateDate = moment(moment()).add(
        config.rateReminder.duration,
        config.rateReminder.unit,
      );
      schedulePopup(rateDate, <RateApp />);

      await AsyncStorage.setItem(
        'appRated',
        JSON.stringify({rated: false, rateDate}),
      );
    }
  }
};
