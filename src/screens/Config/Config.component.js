import React, {Component} from 'react';
import {ScrollView, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import Theme from '../../resources/Theme.js';

import Button from '../../components/Button/Button.component.js';

export default class Config extends Component{
	userLog=()=>{
		this.props.navigation.navigate('UserLogs')
	}
	bitmexConfig=()=>{
		this.props.navigation.navigate('BitmexConfig')
	}
	uiSettings=()=>{
		this.props.navigation.navigate('UISettings')
	}
	deadmanSettings=()=>{
		this.props.navigation.navigate('DeadManSettings')
	}
	tradesNotificationsSettings=()=>{
		this.props.navigation.navigate('TradesNotificationsSettings')
	}
	render(){
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<ScrollView>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"User Logs"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.userLog}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Exchange Config"}
								textStyle={styles.buttonTextStyle} 
								onPress={this.bitmexConfig}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"UI Settings"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.uiSettings}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Trades Notifications Settings"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.tradesNotificationsSettings}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Dead-Man Settings"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.deadmanSettings}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText}/>
						</Button>
					</ScrollView>
				</LinearGradient>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	},
	userLog:{
		marginTop:20
	},
	button:{
		marginTop:2,
		backgroundColor:Theme['dark'].primary3,
		borderRadius:0
	},
	buttonTextStyle:{
		width:'100%',
		textAlign:'left',
		fontSize:14
	}
}
