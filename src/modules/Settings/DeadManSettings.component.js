import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, Platform} from 'react-native';
import { connect } from 'react-redux';
import NumericInput from 'react-native-numeric-input'
import { Switch } from 'react-native-paper';

import Button from '../../components/Button/Button.component.js';
import Input from '../../components/Input/Input.component.js';

import {updateSettings, setDeadMan} from './Settings.actions.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

class DeadManSettings extends Component{
	state={...this.props.settings}
	async componentDidMount(){
		this.setState({...this.props.settings})
	}
	saveSettings=()=>{
		const {enableDeadMan, deadManTimeout, deadManInterval}=this.state;
		if (enableDeadMan){
			Alert.alert("Attention",
						"You have just enabled Dead-Man feature, are you sure ?\n\n"+
						"When this app goes to background Dead-Man route will not be called!\n\n"+
						"If you want Dead-Man feature to work in background make the timeout more than 15 minutes and the interval more than 5 minutes (Not Recommended)",
						[
							{
								text:'Submit',
								onPress: () => {
									Alert.alert("Notice","Please keep this app in foreground based on the timeout you selected.")
									this.props.updateSettings(this.state);
									this.props.setDeadMan(deadManTimeout, deadManInterval);
									this.props.onClose();
								}
							},
							{
								text:'Cancel',
								onPress: () => {}
							}
						])
		}else{
			this.props.updateSettings(this.state);
			this.props.setDeadMan(0, null);
			this.props.onClose();
		}
	}
	render(){
		const {appID, appSecret}=this.state;
		return (
				<View style={styles.container}>
					<View style={styles.column}>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Enable Dead-Man feature</Text>
                                <Switch value={this.state.enableDeadMan}
                                        onValueChange={()=>this.setState({enableDeadMan:!this.state.enableDeadMan})}
                                        color={Theme['dark'].highlighted}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Dead-Man Timeout (sec)</Text>
							<NumericInput onChange={value=>this.setState({deadManTimeout:value})}
										  type='plus-minus'
										  rounded={true} 
										  value={this.state.deadManTimeout}
										  textColor={Theme['dark'].primaryText}
										  totalWidth={100}
										  totalHeight={25}/>
						</View>
						<View style={styles.row}>
							<Text style={styles.textStyle}>Dead-Man Interval (sec)</Text>
							<NumericInput onChange={value=>this.setState({deadManInterval:value})}
										  type='plus-minus'
										  rounded={true} 
										  value={this.state.deadManInterval}
										  textColor={Theme['dark'].primaryText}
										  totalWidth={100}
										  totalHeight={25}/>
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

export default connect(mapStateToProps,{updateSettings, setDeadMan})(DeadManSettings);
