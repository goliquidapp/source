import React, {Component} from 'react';
import {View, ScrollView, Text, Picker, TouchableOpacity, Alert} from 'react-native';
import { connect } from 'react-redux';

import Button from '../../components/Button/Button.component.js';
import Input from '../../components/Input/Input.component.js';

import {updateAuthSettings, clearAuth, updateSettings} from './Settings.actions.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import currencies from './Settings.consts.js'

class Settings extends Component{
	state={...this.props.settings}
	componentDidMount(){
		const {appID,appSecret,currency}=this.props.settings;
		if (!appID && !appSecret){
			Alert.alert("App Configuration","You need to provide App ID and App Secret first !");
		}
		else{
			if (this.props.init)
				this.props.onClose();
		}
		this.setState({...this.props.settings})
	}
	saveSettings=()=>{
		const {appID, appSecret,currency}=this.state;
		if (!appID || !appSecret) {
			this.props.updateAuthSettings({appID:null,appSecret:null});
			this.props.clearAuth();
		}
		else {
			this.props.updateAuthSettings({appID, appSecret});
			this.props.onClose();
		}
		this.props.updateSettings({currency})
	}
	render(){
		const {appID, appSecret, currency}=this.state;
		return (
				<View style={styles.container}>
					<View style={styles.auth}>
						<Input 	onChangeText={(value)=>this.setState({appID:value})}
								value={appID}
								placeholderTextColor={Theme['dark'].secondaryText}
								textStyle={styles.textStyle}
								placeholder={"App ID"}
								containerStyle={styles.input}
								underline={false}/>
						<Input 	onChangeText={(value)=>this.setState({appSecret:value})}
								value={appSecret}
								placeholderTextColor={Theme['dark'].secondaryText}
								textStyle={styles.textStyle}
								placeholder={"App Secret"}
								secureTextEntry={true}
								containerStyle={styles.input}
								underline={false}/>
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Currency</Text>
							<View style={styles.inputRow}>
								<Picker selectedValue={currency.symbolFull}
										style={styles.dropdown}
		                				itemStyle={styles.pickerItemStyle}
										onValueChange={(itemValue)=>this.setState({currency:currencies[itemValue]})}
								>
									{Object.keys(currencies).map((item, index)=>{
										return(
												<Picker.Item key={index.toString()} label={`${item} (${currencies[item].name})`} value={item}/>
											)
									})}
								</Picker>
							</View>
						</View>
					</View>
					<View style={styles.buttons}>
						<Button text={"Save"} onPress={this.saveSettings} buttonStyle={styles.button} textStyle={styles.save}/>
						<Button text={"Cancel"} onPress={this.props.onClose} buttonStyle={[styles.button,styles.cancel]} textStyle={styles.cancel}/>
					</View>
				</View>
			)
	}
}

const styles={
	container:{
		marginVertical:20,
		width:'100%',
		flex:1
	},
	auth:{
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center',
		marginVertical:10
	},
	save:{
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	buttons:{
		flexDirection:'column',
		aignItems:'center',
		justifyContent:'space-between',
		width:'100%',
		alignSelf:'center',
		marginTop:'auto'
	},
	cancel:{
		fontSize:14,
		backgroundColor:'transparent',
		color:Theme['dark'].highlighted,
		elevation:0,
		fontFamily:Theme['dark'].fontNormal
	},
	button:{
		alignSelf:'center',
		marginVertical:10,
		width:'80%'
	},
	textStyle:{
		backgroundColor:Theme['dark'].primary3,
		color:Theme['dark'].primaryText,
		borderRadius:8,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	input:{
		marginBottom:15
	},
	inputContainer:{
		width:'90%',
		alignSelf:'center',
		backgroundColor:Theme['dark'].primary3,
		borderRadius:15,
		paddingVertical:10,
		paddingHorizontal:10,
		alignItems:'center'
	},
	inputRow:{
		width:'90%',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center'
	},
	dropdown:{
		width:'90%',
		color: Theme['dark'].primaryText
	},
	pickerItemStyle:{
        color:Theme['dark'].primaryText,
        height:100,
        fontSize:14,
        fontFamily:Theme['dark'].fontNormal
    },
    label:{
    	alignSelf:'flex-start',
		marginLeft:10,
		color:Theme['dark'].secondaryText,
		fontFamily:Theme['dark'].fontNormal
    }
}

const mapStateToProps=(state)=>{
	return {
		settings:state.settings
	}
}

export default connect(mapStateToProps,{updateAuthSettings, clearAuth, updateSettings})(Settings);
