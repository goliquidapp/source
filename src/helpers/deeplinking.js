import { Linking, Platform } from 'react-native';

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
				.catch((err) => console.log(err));
	}
}

export const openEthWallet=(address=null)=>{
	var url='';
	if (address) {
		url=`https://link.trustwallet.com/send?coin=60&address=${address}`
		Linking.canOpenURL(url)
				.then((supported) => {
					if (!supported) {
				  		console.log("Can't handle url: " + url);
					} else {
				  		return Linking.openURL(url);
					}
				})
				.catch((err) => console.log(err));
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
				.catch((err) => console.log(err));
}

export const playStore=(packageName=null)=>{
    var url=Platform.OS==='android'?
                `market://details?id=${packageName}`:
                `itms-apps://itunes.apple.com/us/app/id${packageName}?mt=8`
	Linking.canOpenURL(url)
				.then((supported) => {
                      if (!supported) {
                        console.log("Can't handle url: " + url);
                      } else {
                        return Linking.openURL(url);
                      }
				})
				.catch((err) => console.log(err));
}
