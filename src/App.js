import React, {Component, useEffect} from 'react';
import { StatusBar, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Provider } from 'react-redux';
import {Notification} from "react-native-in-app-message";
import SplashScreen from 'react-native-splash-screen';
import crashlytics from '@react-native-firebase/crashlytics';

import store from './redux/store';

import Navigation from './routing/router';

import Offline from './components/Offline/Offline.component.js';
import GlobalNotification from './modules/GlobalNotification/GlobalNotification.component.js';
import WebScreen from './modules/WebScreen/WebScreen.component.js';

import LoadingScreen from './screens/LoadingScreen/LoadingScreen.component.js';

import {appAuth} from './helpers/bitmex.helpers.js';
import {loadSettings} from './helpers/settings.js';
import {observe, prices, liquidation, deadmanBackground} from './helpers/watchdog.js';
import {start, orders, deadman, notificationsPermissions} from './helpers/onstart.js';
import NavigationService from './helpers/navigate.js';


import Theme from './resources/Theme.js';
import API from './api/API.js';

export default class App extends Component {
    constructor(props){
        super(props);
        this.state={ready:false,online:false};
        NetInfo.addEventListener(this.handleFirstConnectivityChange);
    }
    bootup=async ()=>{
        try {await appAuth();}
        catch(err){crashlytics().recordError(new Error(err));}
        
        try{await loadSettings();}
        catch(err){crashlytics().recordError(new Error(err));}
        
        observe([prices, liquidation, deadmanBackground])
    }
    componentDidMount(){
        this.bootup();
        this.setState({ready:true,online:true});
        SplashScreen.hide();
    }
    componentWillUnmount(){
        API.wsConnect.clean();
    }
    handleFirstConnectivityChange=(connectionInfo)=>{
        this.setState({online:connectionInfo.isConnected})
    }
    render() {
        const {ready,online}=this.state;
        return (
            <Provider store={store}>
                {
                    ready?
                    (online?<Navigation ref={navigatorRef => NavigationService.setTopLevelNavigator(navigatorRef)}/>:<Offline/>):
                    <LoadingScreen />
                }
                <Notification customComponent={<GlobalNotification/>} autohide={false} onPress={Notification.hide} showKnob={false}/>
                <WebScreen/>
                <StatusBar backgroundColor={Theme['dark'].primary1} barStyle={(Platform.OS === 'ios')?'light-content':''}/>
            </Provider>
        );
    }
}
