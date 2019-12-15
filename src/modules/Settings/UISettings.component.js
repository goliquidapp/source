import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, Platform} from 'react-native';
import { connect } from 'react-redux';
import NumericInput from 'react-native-numeric-input'
import { Switch } from 'react-native-paper';

import Button from '../../components/Button/Button.component.js';
import Input from '../../components/Input/Input.component.js';

import {updateSettings} from './Settings.actions.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

class UISettings extends Component{
	state={...this.props.settings}
	async componentDidMount(){
		this.setState({...this.props.settings})
	}
	saveSettings=()=>{
		this.props.updateSettings(this.state);
		this.props.onClose();
	}
	render(){
		const {appID, appSecret}=this.state;
		return (
				<View style={styles.container}>
					<View style={styles.column}>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Enable In App Notifications</Text>
                                <Switch       value={this.state.showInAppNotifications}
                                              onValueChange={value=>this.setState({showInAppNotifications:!this.state.showInAppNotifications})}
                                              color={Theme['dark'].highlighted}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Enable Push Notifications</Text>
                                <Switch       value={this.state.allowNotifications}
                                              onValueChange={value=>this.setState({showInAppNotifications:!this.state.allowNotifications})}
                                              color={Theme['dark'].highlighted}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Interval check time (minutes)</Text>
							<NumericInput onChange={value=>this.setState({intervalDuration:value})}
										  type='plus-minus'
										  rounded={true} 
										  value={this.state.intervalDuration}
										  textColor={Theme['dark'].primaryText}
										  totalWidth={100}
										  totalHeight={25}
										  valueType='real'
										  step={0.5}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Price change trigger (%)</Text>
							<NumericInput onChange={value=>this.setState({pricesChangeThreshold:value})}
										  type='plus-minus'
										  rounded={true} 
										  value={this.state.pricesChangeThreshold}
										  textColor={Theme['dark'].primaryText}
										  totalWidth={100}
										  totalHeight={25}
										  valueType='real'
										  step={0.5}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Liquidation trigger (%)</Text>
							<NumericInput onChange={value=>this.setState({liquidationThreshold:value})}
										  type='plus-minus'
										  rounded={true} 
										  value={this.state.liquidationThreshold}
										  textColor={Theme['dark'].primaryText}
										  totalWidth={100}
										  totalHeight={25}
										  valueType='real'
										  step={0.5}/>
						</View>
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
		width:'80%',
		fontFamily:Theme['dark'].fontNormal
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

export default connect(mapStateToProps,{updateSettings})(UISettings);
