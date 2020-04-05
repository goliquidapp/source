import React, {Component} from 'react';
import { connect } from 'react-redux';

import {ScrollView, View, Text, TouchableOpacity, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Icon } from 'react-native-elements';

import Theme from '../../resources/Theme.js';
import Material from '../../resources/Material.js';

import Button from '../../components/Button/Button.component.js';
import Popup from '../../components/Popup/Popup.component.js';

import {getAccountsMeta} from '../../modules/Accounts/Accounts.actions.js';

import {privacyPolicy, notifications} from '../../resources/Constants.js';
import {openURL} from '../../helpers/text.js';
import {sleep} from '../../helpers/time.js';

class Config extends Component{
	constructor(props){
		super(props);
		this.state={about:false};
		this.props.getAccountsMeta();
	}
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
	livePubs=()=>{
		this.props.navigation.navigate('PublicationsSettings')
	}
	openAbout=()=>{
		this.setState({about:true})
	}
	closeAbout=()=>{
		this.setState({about:false})
	}
	shapeName=(name)=>{
		return (name[0]+name[1]).toUpperCase();
	}
    handleURL=async ()=>{
        if (Platform.OS==='ios'){
            this.closeAbout();
            await sleep(500)
        }
        openURL('https://goliquid.app')
    }
	renderHeader=()=>{
		const {accounts, current}=this.props.accounts;
		let currentAccountName='';
		return(
			<View style={[styles.row, styles.leftRow]}>
				{
					accounts.map((account, index)=>{
						if (account.ID===current){
							currentAccountName=account.name;
							return(
								<View key={index.toString()} style={[	styles.head, 
												account.primary?styles.primary:{backgroundColor:account.color}
											]}>
									<Text style={styles.headTitle}>{this.shapeName(account.name)}</Text>
								</View>
							)
						}
					})
				}
				<View style={[styles.column,styles.leftColumn]}>
					<Text style={styles.headTitle}>{currentAccountName}</Text>
					<Text style={styles.secondaryText}>BitMEX Account</Text>
				</View>
			</View>
		)
	}
	renderLongText=(text)=>{
		return text.split('\n').map((str,index)=>{
			return (
				<Text style={styles.dialogText} 
					  key={index.toString()}>
					{str}
				</Text>
			)
		})
	}
	renderPopup=()=>{
		const {about}=this.state;
		return (
			<Popup visible={about} onClose={this.closeAbout}>
				<View style={styles.dialog}>
					<ScrollView showsVerticalScrollIndicator={false}>
						<View style={styles.dialogContent}>
							<Text style={styles.title}>About</Text>
							{this.renderLongText(privacyPolicy.intro)}
							<Text style={styles.dialogTitle}>Security</Text>
							{this.renderLongText(privacyPolicy.security)}
							<Text style={styles.dialogTitle}>Log Data</Text>
							{this.renderLongText(privacyPolicy.logData)}
							<Text style={styles.dialogText}></Text>
							<Text style={styles.dialogTextCenter}>
								For more information, please visit our website
							</Text>
							<TouchableOpacity activeOpacity={0.6} style={styles.dialogTextCenter} onPress={this.handleURL}>
			                   <Text style={styles.dialogTextCenter}>
			                         <Text style={[styles.dialogTextCenter,styles.highlightedText]}>GoLiquid.app</Text>
			                   </Text>
			               </TouchableOpacity>
						</View>
					</ScrollView>
					<Button text={`Close`} 
							onPress={this.closeAbout} 
							buttonStyle={styles.dialogButton} 
							textStyle={styles.dialogText}/>
				</View>
			</Popup>
		)
	}
	renderGroupContent=(groupName)=>{
		const ICON_SIZE=14;
		switch(groupName){
			case 'Profile':
				return (
					<View style={styles.column}>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"User Logs"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.userLog}
								icon={{
									name:'earth',
									type:'antdesign',
									reverse:true,
									color:Material['blue']['400'],
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Account Credentials"}
								textStyle={styles.buttonTextStyle} 
								onPress={this.bitmexConfig}
								icon={{
									name:'lock',
									type:'antdesign',
									reverse:true,
									color:Material['purple']['400'],
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
					</View>
				)
			case 'Notifications':
				return (
					<View style={styles.column}>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"In-App Notifications"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.uiSettings}
								icon={{
									name:'bells',
									type:'antdesign',
									reverse:true,
									color:Material['green']['400'],
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Live Trades Notifications"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.tradesNotificationsSettings}
								icon={{
									name:'sharealt',
									type:'antdesign',
									reverse:true,
									color:Material['deep-orange']['400'],
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Live Publications & Sentiments"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.livePubs}
								icon={{
									name:'publish',
									type:'entypo',
									reverse:true,
									color:Material['orange']['400'],
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
					</View>
				)
			case 'Advanced':
				return(
					<View style={styles.column}>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"Dead-Man Settings"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.deadmanSettings}
								icon={{
									name:'disconnect',
									type:'antdesign',
									reverse:true,
									color:Material['red']['400'],
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
					</View>
				)
			case 'GoLiquid':
				return(
					<View style={styles.column}>
						<Button full={true}
								buttonStyle={styles.button} 
								text={"About"} 
								textStyle={styles.buttonTextStyle} 
								onPress={this.openAbout}
								icon={{
									name:'appstore-o',
									type:'antdesign',
									reverse:true,
									color:Theme['dark'].highlighted,
									reverseColor:Theme['dark'].primaryText,
									size:ICON_SIZE,
									containerStyle:styles.icon
								}}>
							<Icon name={"chevron-small-right"} type={"entypo"} color={Theme['dark'].primaryText} style={styles.iconRight}/>
						</Button>
					</View>
				)
			default:
				return <View></View>
		}
	}
	renderGroup=(groupName)=>{
		return(
			<View style={[styles.column, styles.leftColumn, styles.group]}>
				<View style={[styles.row, styles.leftRow, styles.groupHead]}>
					<Text style={styles.secondaryText}>{groupName}</Text>
				</View>
				{this.renderGroupContent(groupName)}
			</View>
		)
	}
	render(){
		const {accounts, current}=this.props.accounts;

		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.container}>
					<ScrollView>
						{this.renderHeader()}
						{this.renderGroup('Profile')}
						{this.renderGroup('Notifications')}
						{this.renderGroup('Advanced')}
						{this.renderGroup('GoLiquid')}
					</ScrollView>
					{this.renderPopup()}
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
	icon:{
		marginLeft:10,
		marginRight:30,
		width:'10%'
	},
	iconRight:{
		width:'10%'
	},
	buttonTextStyle:{
		width:'80%',
		textAlign:'left',
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	dialog:{
		width:'100%',
		backgroundColor:Theme['dark'].primary3,
		alignSelf:'center',
		padding:20,
		borderRadius:20
	},
	dialogContent:{
		width:'100%',
		alignSelf:'center'
	},
	dialogButton:{
		marginTop:20,
		width:'60%',
		alignSelf:'center'
	},
	dialogText:{
		color: Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	dialogTextCenter:{
		color: Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal,
		textAlign:'center'
	},
	dialogTitle:{
		marginVertical: 10,
		color: Theme['dark'].primaryText,
		fontSize:16,
		fontWeight:'bold',
		alignSelf:'center',
		fontFamily:Theme['dark'].fontBold
	},
	title:{
		color: Theme['dark'].primaryText,
		fontSize:29,
		fontWeight:'bold',
		width:'100%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontBold
	},
	highlightedText:{
		color: Theme['dark'].highlighted,
		textDecorationLine:'underline',
		fontFamily:Theme['dark'].fontBold
	},
	row:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		alignSelf:'center',
		padding:10
	},
	column:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center'
	},
	leftRow:{
		justifyContent:'flex-start'
	},
	leftColumn:{
		alignItems:'flex-start'
	},
	primary:{
		backgroundColor:Theme['dark'].highlighted
	},
	head:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		width: 64,
		height:64,
		borderRadius:32,
		backgroundColor:Theme['dark'].primary3,
		borderColor:Theme['dark'].primaryText,
		borderWidth:5,
		borderType:'solid',
		marginRight:20,
		marginLeft:10
	},
	headTitle:{
		color:Theme['dark'].primaryText,
		fontSize:18,
		fontFamily:Theme['dark'].fontFamily,
		textAlign:'center'
	},
	secondaryText:{
		fontSize:14,
		fontFamily:Theme['dark'].fontFamily,
		color:Theme['dark'].secondaryText
	},
	groupHead:{
		marginLeft:15
	},
	group:{
		marginTop:20
	}
}

const mapStateToProps=(state)=>{
	return {
		accounts:state.accounts
	}
}

export default connect(mapStateToProps,{getAccountsMeta})(Config)

