import React, {Component} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Icon} from 'react-native-elements';

import Button from '../Button/Button.component.js';
import Theme from '../../resources/Theme.js';
import config from '../../config.js';
import {playStore} from '../../helpers/deeplinking.js';

class RateApp extends Component{
	componentDidMount(){
		
	}
	rateApp=async ()=>{
		playStore(config.packageName);
		await AsyncStorage.setItem('appRated', JSON.stringify({rated:true, rateDate:null}));

		this.props.onClose()
	}
	render(){
		return (
				<View style={styles.dialog}>
					<View style={styles.dialogContent}>
						<Text style={styles.dialogTitle}>Rate Us</Text>
						<Text style={styles.dialogText}>Tell others what you think about this app</Text>
						<View style={styles.row}>
							<Icon name="star" type="entypo" color={Theme['dark'].warning} size={40}/>
							<Icon name="star" type="entypo" color={Theme['dark'].warning} size={40}/>
							<Icon name="star" type="entypo" color={Theme['dark'].warning} size={40}/>
							<Icon name="star" type="entypo" color={Theme['dark'].warning} size={40}/>
							<Icon name="star" type="entypo" color={Theme['dark'].warning} size={40}/>
						</View>
					</View>
					<Button text={`Rate Our App`} onPress={this.rateApp} buttonStyle={styles.dialogButton} textStyle={styles.dialogText}/>
					<Button text={'Maybe Later'} onPress={this.props.onClose} buttonStyle={[styles.dialogButton, styles.cancelButton]} textStyle={styles.dialogText}/>
				</View>
			)
	}
}

const styles={
	dialog:{
		width:'100%',
		backgroundColor:Theme['dark'].primary3,
		alignSelf:'center',
		padding:20,
		borderRadius:20
	},
	dialogContent:{
		width:'100%',
		alignSelf:'center',
		alignItems:'center',
		paddingTop:20
	},
	dialogButton:{
		marginTop:20,
		width:'60%',
		alignSelf:'center',
		backgroundColor:Theme['dark'].highlighted,
		color: Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontNormal
	},
	cancelButton:{
		backgroundColor:'transparent',
		color:Theme['dark'].negative,
		elevation:0,
		fontFamily:Theme['dark'].fontNormal
	},
	dialogText:{
		color: Theme['dark'].primaryText,
		fontSize:18,
		fontFamily:Theme['dark'].fontNormal
	},
	dialogTitle:{
		marginVertical: 10,
		color: Theme['dark'].primaryText,
		fontSize:20,
		fontWeight:'bold',
		alignSelf:'center',
		fontFamily:Theme['dark'].fontBold
	},
	row:{
		flexDirection:'row',
		alignItems:'center',
		marginVertical:20
	}
}

export default RateApp;
