export const privacyPolicy={
	intro:"Liquid is a free app and is intended for use as is, however it is not a product of BitMEX and it does not relate to BitMEX.",
	logData:"We want to inform you that whenever you use Liquid, in a case of an error in the app we collect data and information (through third party products) on your phone called Log Data. \nThis Log Data may include information\
	such as your device brand and name, operating system version, the configuration of the app, the time and date of your use of the application.",
	security:"This application does not in any way send the App ID and App Secret to any external sites or third party sites or services except the use\
	of authenticating with the official exchange API through their secured protocol. \nIn addition to this App ID and App Secret are encrypted with AES 256 and the key of encryption is stored in Keychain (iOS)/Keystore (Android) which makes it non-exportable and secured.\
	\nLiquid also uses no backend and all data are cached locally and securely on your device.",
	summary:'Your API key and secret will be encrypted by AES and stored locally so that it\'ll be safe to track balance and trade with.'
}
export const help={
	DEAD_MAN_HELP:'BitMEX offers “Dead Man’s Switch” functionality to help prevent unexpected losses from network malfunctions. If you are putting up significant risk on BitMEX, it can be nerve-wracking to think of what might happen if you or your datacenter loses connectivity.\n\nAdvanced users of BitMEX should use this operation. A common use pattern is to set a timeout of 60 seconds, and call it every 15 seconds. This gives you sufficient wiggle room to keep your orders open in case of a network hiccup, while still offering significant protection in case of a larger outage. Of course, the parameters are up to you.',
	TRADES_NOTIF:'Receive push notifications whenever a high size trades are taking place.',
	PUBS_NOTIF:'Receive push notifications about articles and tweets related to crypto currencies in addition to sentiment analysis.'
}

export const notifications={
	usage:' \nTo receive notifications for your position and warnings about liquidation please keep the app running in background and don\'t close it.\n\nMeanwhile, we are working on our notifications server to be up and running in no time.'
}
