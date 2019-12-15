/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import crashlytics from '@react-native-firebase/crashlytics';
import {setJSExceptionHandler, setNativeExceptionHandler } from 'react-native-exception-handler';
import BackgroundFetch from "react-native-background-fetch";

import {headlessObserve, prices, liquidation, deadmanBackground} from './src/helpers/watchdog.js';

setJSExceptionHandler((error,isFatal)=>{
	crashlytics().recordError(new Error(error));
},allowInDevMode=false)

setNativeExceptionHandler((error)=>{
	crashlytics().recordError(new Error(error));
},forceAppQuit=true,executeDefaultHandler=true);

BackgroundFetch.registerHeadlessTask(()=>headlessObserve([prices, liquidation, deadmanBackground]));
AppRegistry.registerComponent(appName, () => App);
