import React, {Component} from 'react';
import {KeyboardAvoidingView, View, Text, RefreshControl, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import QRScannerView from '../../components/QRScanner/QRScanner.js';

import {requestWithdrawal, getMinFee} from './Withdraw.actions.js';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import Input from '../../components/Input/Input.component.js';
import Button from '../../components/Button/Button.component.js';
import Popup from '../../components/Popup/Popup.component.js';
import IconButton from '../../components/IconButton/IconButton.component.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import {openBitcoinWallet, open2FA} from '../../helpers/deeplinking.js';

class Withdraw extends Component{
	constructor(props){
		super(props);
		const {fee}=this.props.withdraw;
		this.state={
			otpToken:'',
			amount:'',
			address:'',
			text:'',
			fee:(fee.fee*10e-9).toString(),
			showQRScanner:false
		}
	}
	componentDidMount(){
		this.props.getMinFee();
	}
	componentDidUpate(){
		if (prevProps.withdraw.fee.fee!==this.props.withdraw.fee.fee){
			const {fee}=this.props.withdraw;
			this.setState({fee:(fee.fee*10e-9).toString()})
		}
	}
	withdraw=()=>{
		const {amount, address}=this.state;
		if (!amount || !address) Alert.alert('Withdraw','Please fill all required fields!')
		else{
			const message=`You are about to withdraw ${amount} XBT to address:\n\n${address}\n\nContinue ?`;
			Alert.alert('Withdraw',
					message,
					[
						{
							text: 'OK',
							onPress: () => {
								this.props.requestWithdrawal({...this.state})
							}
						},
						{
							text: 'Cancel',
							onPress: () => {}
						}
					])
		}
	}
	renderForm=()=>{
		const {otpToken, amount, address, text, fee}=this.state;
		return (
				<View style={styles.column}>
					<View style={styles.row}>
						<Input  placeholder="Bitcoin address"
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								value={address}
								onChangeText={(value)=>this.setState({address:value})}
								nextRef={this.input2}/>
						<TouchableOpacity style={styles.icon} onPress={()=>this.setState({showQRScanner:true})}>
							<Icon name="scan1" type="antdesign" color={Theme['dark'].highlighted} size={18}/>
						</TouchableOpacity>
					</View>
					<View style={styles.row}>
						<Input  placeholder="Amount (XBT)"
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								value={amount}
								keyboardType={"number-pad"}
								onChangeText={(value)=>this.setState({amount:value})}
								nextRef={this.input3}
								ref={(ref)=>this.input2=ref}/>
						<TouchableOpacity style={styles.icon}>
							<Icon name="bitcoin" type="font-awesome" color={Theme['dark'].highlighted} size={18}/>
						</TouchableOpacity>
					</View>
					<View style={styles.row}>
						<Input  placeholder="Bitcoin Network Fee (XBT)"
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								value={fee}
								keyboardType={"number-pad"}
								onChangeText={(value)=>this.setState({fee:value})}
								nextRef={this.input4}
								ref={(ref)=>this.input3=ref}/>
					</View>
					<View style={styles.row}>
						<Input  placeholder="2FA token"
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								value={otpToken}
								keyboardType={"number-pad"}
								onChangeText={(value)=>this.setState({otpToken:value})}
								nextRef={this.input5}
								ref={(ref)=>this.input4=ref}/>
						<TouchableOpacity style={styles.icon} onPress={()=>open2FA()}>
							<Icon name="two-factor-authentication" type="material-community" color={Theme['dark'].highlighted} size={18}/>
						</TouchableOpacity>
					</View>
					<View style={styles.row}>
						<Input  placeholder="Note (Optional)"
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								value={text}
								onChangeText={(value)=>this.setState({text:value})}
								ref={(ref)=>this.input5=ref}/>
						<TouchableOpacity style={styles.icon}>
							<Icon name="note" type="octicons" color={Theme['dark'].highlighted} size={18}/>
						</TouchableOpacity>
					</View>
					<View style={styles.row}>
						<Button text="Submit" onPress={this.withdraw} textStyle={styles.buttonText}/>
					</View>
				</View>
			)
	}
	renderQRScanner=()=>{
		const {showQRScanner} = this.state;
		if (!showQRScanner) return <View></View>
		else {
			return (
					<Popup visible={showQRScanner} onClose={()=>this.setState({showQRScanner:false})}>
						<View style={{width:'100%',height:'100%'}}>
                            <TouchableOpacity style={styles.close} onPress={()=>this.setState({showQRScanner:false})}>
                                <Icon name="close" color={Colors['White']}/>
                            </TouchableOpacity>
							<QRScannerView
								onScanResult={({data})=>this.setState({address:data,showQRScanner:false})}
								scanBarAnimateReverse={ true }
								hintText={"Scan Bitcoin address"}
							/>
						</View>
					</Popup>
				)
		}
	}
	renderError=()=>{
        const {error}=this.props.withdraw;
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
		return(
				<KeyboardAvoidingView behavior="padding" enabled>
					{this.renderForm()}
					{this.renderQRScanner()}
					{this.renderError()}
				</KeyboardAvoidingView>
			)
	}
}


const styles={
	row:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'95%',
		alignSelf:'center',
		padding:10
	},
	column:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center'
	},
	textStyle:{
		color:Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	icon:{
		position:'absolute',
		bottom:40,
		right:30
	},
    close:{
        position:'absolute',
        top:30,
        left:30,
        zIndex:10
    },
    buttonText:{
    	fontSize:14,
    	fontFamily:Theme['dark'].fontNormal
    }
}

const mapStateToProps=(state)=>{
	return {
		withdraw:state.withdraw
	}
}
export default connect(mapStateToProps,{requestWithdrawal, getMinFee})(Withdraw);
