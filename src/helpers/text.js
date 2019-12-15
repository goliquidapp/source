import { ToastAndroid,Clipboard, Linking} from 'react-native';
import config from '../config.js';
import store from '../redux/store.js';
import {WEB_SCREEN_OPENED} from '../modules/WebScreen/WebScreen.types.js';

export const copyToClipboard=(value)=>{
	Clipboard.setString(value);
    ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
}

export const openURL=(url)=>{
	store.dispatch({
		type:WEB_SCREEN_OPENED,
		payload:{
			url
		}
	});
}