import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, Platform} from 'react-native';
import { connect } from 'react-redux';
import NumericInput from 'react-native-numeric-input'
import messaging from '@react-native-firebase/messaging';
import { Switch } from 'react-native-paper';

import Button from '../../components/Button/Button.component.js';
import Input from '../../components/Input/Input.component.js';

import {updateSettings} from './Settings.actions.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';
import config from '../../config.js';

class TradesSettings extends Component{
	state={...this.props.settings}
	async componentDidMount(){
		this.setState({...this.props.settings})
	}
	saveSettings=()=>{
		this.state.channels.map((channel)=>{
			if (channel.enabled){
				this.subscribe(channel.label);
			}else{
				this.unsubscribe(channel.label);
			}
		})
		this.props.updateSettings(this.state);
		this.props.onClose();
	}
	subscribe=async (channel)=>{
		try{
			var response=await messaging().subscribeToTopic(channel);
		}catch(err){
			if (config.debug)
				console.log(err);
		}
	}
	unsubscribe=async (channel)=>{
		try{
			var response=await messaging().unsubscribeFromTopic(channel);
		}catch(err){
			if (config.debug)
				console.log(err);
		}
	}
	updateChannel=(index)=>{
		var newChannels=[...this.state.channels];
		newChannels[index].enabled=!newChannels[index].enabled;
		this.setState({channels:newChannels})
	}
	renderCheckToggle=(index)=>{
		return (
				<View style={styles.row} key={index.toString()}>
					<Text style={styles.textStyle}>{this.state.channels[index].label}</Text>
                        <Switch value={this.state.channels[index].enabled}
                                onValueChange={()=>this.updateChannel(index)}
                                color={Theme['dark'].highlighted}/>
	            </View>
			)
	}
	render(){
		const {appID, appSecret}=this.state;
		return (
				<View style={styles.container}>
					<View style={styles.column}>
						{this.state.channels.map((channel,index)=>this.renderCheckToggle(index))}
					</View>
					<View style={styles.buttons}>
						<Button text={"Save"} onPress={this.saveSettings} buttonStyle={styles.button} textStyle={styles.save}/>
						<Button color={Colors['Tuna']} text={"Cancel"} onPress={this.props.onClose} buttonStyle={[styles.button,styles.cancel]} textStyle={styles.cancel}/>
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
	cancel:{
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
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
		color:Theme['dark'].primaryText,
		fontSize:14,
		width:'80%',
		marginRight:'auto',
		fontFamily:Theme['dark'].fontNormal
	},
    switch:{
        width:62,
        height:26,
        borderRadius: 18,
        padding: 5
    },
    circle:{
        width: 20,
        height: 20,
        borderRadius: 15,
    }
}

const mapStateToProps=(state)=>{
	return {
		settings:state.settings
	}
}

export default connect(mapStateToProps,{updateSettings})(TradesSettings);
