import React , {Component} from 'react';
import { View , Text, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import { connect } from 'react-redux';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

import {subscribe, getMyBalance} from './Balance.actions.js';

import {satoshiToBitcoin} from '../../helpers/finance.js';

import Theme from '../../resources/Theme.js';

export class Balance extends Component{
	componentDidMount(){
		this.props.subscribe();
		this.props.getMyBalance();
	}
    renderBalance=()=>{
    	const {loading, realtimeData, error}=this.props.balance;
    	var balance=realtimeData[0];

    	if (!balance)
    		return (
    				<View style={styles.placeholder}>
    					<Text style={styles.placeholderText}> - / - </Text>
    				</View>
    			)
    	else if (loading)
    		return (
    				<View style={styles.placeholder}>
    					<ActivityIndicator size={'small'}/>
    				</View>
    			)
    	else
	    	return (
	    			<Animatable.View animation={"fadeInUp"} useNativeDriver duration={Theme.Transition} style={styles.balance}>
	    				<Text style={styles.text}>{`${satoshiToBitcoin(balance.walletBalance)} / ${satoshiToBitcoin(balance.availableMargin)}`}</Text>
	    			</Animatable.View>
	    		)

    }
    renderCurrency=()=>{
    	const {loading, realtimeData, error}=this.props.balance;
    	var balance=realtimeData[0];
    	if (!balance)
    		return (
    				<View style={styles.placeholder}></View>
    			)
    	else if (loading)
    		return (
    				<View style={styles.placeholder}></View>
    			)
    	else 
    		return (
    			<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition*2} >
    				<Text style={styles.currency}>{balance.currency.toUpperCase()}</Text>
    			</Animatable.View>
    		)
    }
    renderLabels=()=>{
    	return (
			<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition*2} style={styles.balance}>
				<Text style={styles.label}>{`Wallet Balance / Available Balance`}</Text>
			</Animatable.View>
		)
    }
    renderError=()=>{
        const {error}=this.props.balance;
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
	render(){
		const {loading, realtimeData, error}=this.props.balance;
		return (
			<View style={styles.container}>
				{this.renderCurrency()}
				{this.renderBalance()}
				{this.renderLabels()}
				{this.renderError()}
			</View>
		)
	}
}

const styles={
	container:{
		width:'80%',
		height:80,
		marginVertical:20,
		flexDirection:'column',
		alignSelf:'center',
		alignItems:'center',
		justifyContent:'flex-start'
	},
	balance:{
		width:'80%',
		alignItems:'center',
		justifyContent:'center',
		alignSelf:'center',
		flexDirection:'row'
	},
	text:{
		color:Theme['dark'].primaryText,
		fontSize:26,
		fontFamily:Theme['dark'].fontNormal
	},
	placeholder:{
		width:'80%',
		alignItems:'center',
		justifyContent:'center',
		alignSelf:'center',
		flexDirection:'row',
	},
	placeholderText:{
		fontSize:26,
		color:Theme['dark'].disabled,
		fontFamily:Theme['dark'].fontNormal
	},
	currency:{
		color:Theme['dark'].highlighted,
		fontSize:16
	},
	label:{
		marginTop:10,
		fontSize:12,
		color:Theme['dark'].secondaryText
	}
}

const mapStateToProps=(state)=>{
	return {
		balance:state.balance
	}
}
export default connect(mapStateToProps,{subscribe, getMyBalance})(Balance);

