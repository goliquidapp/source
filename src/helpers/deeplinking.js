import { Linking } from 'react-native';

export const openBitcoinWallet=(address=null)=>{
	var url='';
	if (address) {
		url=`bitcoin:${address}`
		Linking.canOpenURL(url)
				.then((supported) => {
					if (!supported) {
				  		console.log("Can't handle url: " + url);
					} else {
				  		return Linking.openURL(url);
					}
				})
				.catch((err) => console.error('An error occurred', err));
	}
}

export const open2FA=(type=null)=>{
	var url=`otpauth://${type}`
	Linking.canOpenURL(url)
				.then((supported) => {
					if (!supported) {
				  		console.log("Can't handle url: " + url);
					} else {
				  		return Linking.openURL(url);
					}
				})
				.catch((err) => console.error('An error occurred', err));
}