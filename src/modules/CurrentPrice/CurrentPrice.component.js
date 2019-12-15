import React, {Component} from 'react';
import {View, Text} from 'react-native';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';

import {subscribe, getRecentTrades, unsubscribe} from './RecentTrades.actions.js';

import {lastTrade} from '../../helpers/finance.js';

class CurrentPrice extends Component{
	componentDidMount(){
		this.props.subscribe();
		this.props.getRecentTrades();
	}
	componentDidUpdate(prevProps){
		if (prevProps.settings.currency.symbolFull!==this.props.settings.currency.symbolFull){
			this.props.unsubscribe(prevProps.settings.currency);
			this.props.getRecentTrades();
			this.props.subscribe();
		}
	}
	render(){
		const {realtimeData, loading}=this.props.recentTrades;
		const {currency}=this.props.settings;

		const {buy, sell}=lastTrade(realtimeData);
		
		var val=(buy.price>sell.price)?buy:sell;
		var usdXbt=(val.homeNotional/val.size).toFixed(7);

		return (
			<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
				<View style={styles.wrapper} onPress={this.props.getRecentTrades}>
					<View style={styles.column2}>
						<View style={styles.row}>
							<Text style={styles.primary}>{currency.symbol==="ETH"?"Ether":"Bitcoin"}</Text>
							<Text style={styles.secondary}>{currency.symbol}/{currency.orders}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.price}>{currency.currencySign} {val.price}</Text>
						</View>
					</View>
					<Text style={styles.separator}>/</Text>
					<View style={styles.column}>
						<View style={styles.row}>
							<Text style={styles.normal}>1 {currency.orders}</Text>
						</View>
						<View style={styles.row}>
							<Text style={styles.percentage[val.tickDirection]}>{isNaN(usdXbt)?'':usdXbt} {currency.symbol}</Text>
						</View>
					</View>
				</View>
			</LinearGradient>
		)
	}
}

const styles={
	container:{
		width:'100%',
		height:'20%',
		alignItems:'center',
		justifyContent:'center'
	},
	wrapper:{
		width:'85%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		alignSelf:'center'
	},
	row:{
		width:'100%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-start'
	},
	column:{
		width:'40%',
		flexDirection:'column',
		alignItems:'flex-start',
		justifyContent:'space-around'
	},
	column2:{
		width:'60%',
		flexDirection:'column',
		alignItems:'flex-start',
		justifyContent:'space-around'
	},
	percentage:{
		ZeroPlusTick:{
			color:Theme['dark'].positive,
			fontSize:16,
			marginLeft:'auto'
		},
		PlusTick:{
			color:Theme['dark'].positive,
			fontSize:16,
			marginLeft:'auto'
		},
		MinusTick:{
			color:Theme['dark'].negative,
			fontSize:16,
			marginLeft:'auto'
		},
		ZeroMinusTick:{
			color:Theme['dark'].negative,
			fontSize:16,
			marginLeft:'auto'
		}
	},
	primary:{
		color:Theme['dark'].highlighted,
		marginRight:10,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	secondary:{
		color:Theme['dark'].secondaryText,
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal
	},
	price:{
		color:Theme['dark'].highlighted,
		fontSize:28,
		fontFamily:Theme['dark'].fontNormal
	},
	separator:{
		color:Theme['dark'].primaryText,
		fontSize:28,
		fontFamily:Theme['dark'].fontNormal
	},
	normal:{
		color:Theme['dark'].primaryText,
		marginLeft:'auto',
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal
	}
}

const mapStateToProps=(state)=>{
	return {
		recentTrades:state.recentTrades,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{subscribe, getRecentTrades, unsubscribe})(CurrentPrice);
