import React, {Component} from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import * as Animatable from 'react-native-animatable';
import Qr from 'react-native-qrcode-svg';
import Share, {ShareSheet} from 'react-native-share';

import {getDepositAddress} from './Deposit.actions.js';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';
import {copyToClipboard} from '../../helpers/text.js';
import {openBitcoinWallet} from '../../helpers/deeplinking.js';

var Btx = require('../../resources/icons/coins/Btx.png');

export class Deposit extends Component{
	constructor(props){
		super(props);
		this.qrCode=null;
	}
	componentDidMount(){
		this.props.getDepositAddress();
	}
	shareQR=()=>{
        this.qrCode.toDataURL(async(data)=>{
            try{
                var res=await Share.open({url:'data:image/png;base64,'+data,title: "HP QR Code"})
            }
            catch(err){
            }
        });
    }
	renderTitle=()=>{
		const {address, loadingAddress}=this.props.deposit;
		if (!address){
			return <View></View>
		}else{
			return (
				<View style={styles.row}>
					<Text style={styles.title}>{"Deposit"}</Text>
				</View>
			)
		}
	}
	renderDepositAddress=()=>{
		const {address, loadingAddress}=this.props.deposit;
		if (loadingAddress){
			return <ActivityIndicator/>
		}
		else if (!address){
			return <View></View>
		}
		else{
			return (
				<View style={styles.addressContainer}>
					<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition} style={styles.qrContainer}>
						<TouchableOpacity onPress={()=>openBitcoinWallet(address)}>
							<Qr
			                    value={address}
			                    size={200}
			                    logoSize={60}
			                    logoBackgroundColor={'transparent'}
			                    logo={Btx}
			                    getRef={(c) => (this.qrCode = c)}
			                />
			            </TouchableOpacity>
		                <Animatable.View animation={"bounceIn"} useNativeDriver duration={Theme.Transition} delay={(Theme.Transition/4)} style={styles.share}>
			                <Icon
		                        size={15}
		                        name={'share'}
		                        color={Theme['dark'].highlighted}
		                        reverse
		                        raised
		                        onPress={this.shareQR}
		                    />
		                </Animatable.View>
		            </Animatable.View>
                    <TouchableOpacity style={styles.copy} onPress={()=>copyToClipboard(address)}>
                    	<Text style={styles.address}>{address}</Text>
                    	<Icon
	                        size={20}
	                        name={'copy'}
	                        type={'feather'}
	                        color={Theme['dark'].highlighted}
	                    />
                    </TouchableOpacity>
	            </View>
			)
		}
	}
	renderError=()=>{
        const {error}=this.props.deposit;
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
				<View>
					{this.renderTitle()}
					{this.renderDepositAddress()}
					{this.renderError()}
				</View>
			)
	}
}


const styles={
	title:{
		alignSelf:'center',
		marginLeft:'auto',
		marginRight:'auto',
		color:Theme['dark'].primaryText,
		fontSize:18,
		marginVertical:20,
		fontFamily:Theme['dark'].fontBold
	},
	addressContainer:{
		width:'100%',
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center'
	},
	qrContainer:{
		alignSelf:'center',
		padding:10,
		borderColor:Theme['dark'].secondaryText,
		backgroundColor:Colors['White'],
		borderWidth:1,
		elevation:5,
		marginVertical:20
	},
	share:{
		position:'absolute',
		top:-15,
		right:-15
	},
	copy:{
		width:'90%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around'
	},
	address:{
		fontSize:14,
		color:Theme['dark'].primaryText,
		padding:10,
		fontFamily:Theme['dark'].fontNormal
	}
}

const mapStateToProps=(state)=>{
	return {
		deposit:state.deposit
	}
}
export default connect(mapStateToProps,{getDepositAddress})(Deposit);