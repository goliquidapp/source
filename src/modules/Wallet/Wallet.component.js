import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

import {satoshiToBitcoin} from '../../helpers/finance.js';

import { getMyWallet } from './Wallet.actions.js';

class Wallet extends Component{
	componentDidMount(){
		this.props.getMyWallet();
	}
	componentDidUpdate(prevProps){
		if (prevProps.settings.appID!==this.props.settings.appID && this.props.settings.appID){
			this.props.getMyWallet();
		}
	}
	renderError=()=>{
        const {error}=this.props.wallet;
        if (error) {
            var message='';
            if (error.response){
                if (error.response.data.error)
                    message=error.response.data.error.message
                else
                    message=error.message
            }else {
                message=error.message;
            }
            return <ErrorPopup message={message}/>
        }
        else{
            return <View></View>
        }
    }
    renderPlaceholder=()=>{
    	const {loading, data, error}=this.props.wallet
    	if (loading)
	    	return (
	    			<View></View>
	    		)
    }
    renderWallet=()=>{
		const {loading, data, error}=this.props.wallet
		if (loading)
			return <View></View>
		else if (data.currency)
	    	return(
	    		<View>
	    			<View style={styles.row}>
						<Text style={styles.title}>{"Wallet"}</Text>
					</View>
	    			<View style={styles.row}>
						<Text style={styles.label}>{"Wallet Balance"}</Text>
						<Text style={styles.value}>{`${satoshiToBitcoin(data.walletBalance)} ${data.currency.toUpperCase()}`}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>{"Margin Balance"}</Text>
						<Text style={styles.value}>{`${satoshiToBitcoin(data.marginBalance)} ${data.currency.toUpperCase()}`}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>{"Unrealised PNL"}</Text>
						<Text style={styles.value}>{`${satoshiToBitcoin(data.unrealisedPnl)} ${data.currency.toUpperCase()}`}</Text>
					</View>
					<View style={styles.row}>
						<Text style={styles.label}>{"Available Balance"}</Text>
						<Text style={styles.value}>{`${satoshiToBitcoin(data.availableMargin)} ${data.currency.toUpperCase()}`}</Text>
					</View>
					<View style={styles.row}>
						<Text style={[styles.value,styles.footer]}>
							{`${(data.marginUsedPcnt*100).toFixed(0)}% Margin Used ${data.marginLeverage.toFixed(2)}x Leverage`}
						</Text>
					</View>
				</View>
	    		)
	   	else return <View></View>
    }
    renderRefreshControl=()=>{
		return <RefreshControl 	refreshing={this.props.wallet.loading}
								onRefresh={this.props.getMyWallet} />
	}
	render(){
		const {loading, data, error}=this.props.wallet
		return (
			<View>
				<ScrollView refreshControl={this.renderRefreshControl()} nestedScrollEnabled={true}>
					{this.renderWallet()}
					{this.renderPlaceholder()}
					{this.renderError()}
				</ScrollView>
			</View>
		)
	}
}

const styles={
	row:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		width:'80%',
		alignSelf:'center',
		padding:10
	},
	title:{
		alignSelf:'center',
		marginLeft:'auto',
		marginRight:'auto',
		fontWeight:'bold',
		color:Theme['dark'].primaryText,
		fontSize:18,
		fontFamily:Theme['dark'].fontNormal
	},
	label:{
		color:Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	value:{
		color:Theme['dark'].primaryText,
		fontWeight:'bold',
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	footer:{
		fontFamily:Theme['dark'].fontBold
	}
}

const mapStateToProps=(state)=>{
	return {
		wallet:state.wallet,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{getMyWallet})(Wallet);
