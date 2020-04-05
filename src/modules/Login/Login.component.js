import React, {Component} from 'react';
import { LayoutAnimation, UIManager, KeyboardAvoidingView, Keyboard ,View, ScrollView, Text, RefreshControl, Alert, Image, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, Platform} from 'react-native';
import { connect } from 'react-redux';
import {Icon} from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

import Button from '../../components/Button/Button.component.js';
import Input from '../../components/Input/Input.component.js';
import Popup from '../../components/Popup/Popup.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

import {updateAuthSettings, validateAuth} from '../Settings/Settings.actions';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import {privacyPolicy, notifications} from '../../resources/Constants.js';

import Logo from '../../resources/icons/logo.js';

import {openURL} from '../../helpers/text.js';
import NavigationService from '../../helpers/navigate.js';

import config from '../../config.js';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


class Login extends Component{
    constructor(props){
    	super(props);
    	this.state={appID:'',appSecret:'', privacyPolicyVisible: false, initStatement:true, proceed:false, hideBadge:false, showCover:true, peekBig:false};
    	this.secretInput=React.createRef();
    }
    async componentDidMount(){
		const {appID,appSecret}=this.props.settings;
		if (!appID || !appSecret){
			//this.timer=setTimeout(()=>this.setState({hideBadge:true}),10000)
		}
		else{
			this.props.onClose();
		}
		this.setState({...this.props.settings})

		this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
		this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
		this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
		this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}
	componentDidUpdate(prevProps){
		if (this.props.settings.validAuth && !prevProps.settings.validAuth){
			const {appID, appSecret}=this.state;
			this.props.updateAuthSettings({appID, appSecret});
			this.openPolicy(true);
		}
	}
	componentWillUnmount(){
		this.keyboardWillShowSub.remove();
		this.keyboardWillHideSub.remove();
		this.keyboardDidShowSub.remove();
		this.keyboardDidHideSub.remove();
	}
	setNextTransition=()=>{
		LayoutAnimation.configureNext(LayoutAnimation.create(200,'easeInEaseOut','opacity'));
	}
	keyboardWillShow=(event)=>{
		this.setNextTransition();
		this.setState({showCover:false})
	}
	keyboardWillHide=(event)=>{
		this.setNextTransition();
		this.setState({showCover:true})
	}
	keyboardDidShow=(event)=>{
		this.setNextTransition();
		this.setState({showCover:false})
	}
	keyboardDidHide=(event)=>{
		this.setNextTransition();
		this.setState({showCover:true})
	}
	openPolicy=(proceed=false)=>{
		this.setState({privacyPolicyVisible:true, proceed})
	}
	closePolicy=()=>{
		this.setState({privacyPolicyVisible:false},()=>{
			if (this.state.proceed) this.props.onClose();
		})
	}
	closeInitStatement=()=>{
		this.setState({initStatement:false})
	}
	saveSettings=()=>{
		Keyboard.dismiss();
		const {appID, appSecret}=this.state;
		if (appID && appSecret){
			this.props.validateAuth({appID, appSecret})
		}else{
			Alert.alert("App Configuration","Please enter your credentials first.\n\nCredentials are encrypted and stored in this device.");
		}
	}
	openDemo=()=>{
		this.setNextTransition();
		this.setState({peekBig:true},()=>{
			setTimeout(()=>NavigationService.navigate('Home'),200)
		})
	}
	renderPrivacyBadge=()=>{
		const {hideBadge}=this.state;
		return (
				<Animatable.View animation={hideBadge?"slideOutUp":"slideInDown"} useNativeDriver duration={Theme.Transition} style={[styles.row,styles.notification]}>
					<Icon name="shield" type="material-community" size={20} color={Theme['dark'].primaryText}/>
					<Text style={styles.header}>
						{privacyPolicy.summary}
					</Text>
				</Animatable.View>
			)
	}
	renderHeader=()=>{
		const {showCover}=this.state;
		const keyboardAwareStyle=showCover?{}:{flex:1}

		return (
			<View style={[styles.cover,keyboardAwareStyle]}>
				<Logo width={'50%'} height={'50%'}/>
				{
					showCover&&
					<View style={styles.textContainer}>
						<Text style={styles.title}>Authenticate with</Text>
						<Text style={styles.title}>
							<Text style={[styles.title,styles.highlightedText]}>{(Platform.OS === 'ios' && !config.testFlight)?'exchange':'Bitmex'}</Text> API Keys
						</Text>
					</View>
				}
			</View>
		)
	}
	renderForm=()=>{
		const {appID, appSecret, showCover}=this.state;
		const {loading}=this.props.settings;
		const keyboardAwareStyle=showCover?{}:{marginTop:60}

		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<KeyboardAvoidingView contentContainerStyle={[styles.formOpen,keyboardAwareStyle]} style={styles.form} behavior="position" enabled>
					<View style={styles.auth}>
						<Input 	onChangeText={(value)=>this.setState({appID:value})}
								value={appID}
								placeholderTextColor={Theme['dark'].secondaryText}
								textStyle={styles.textStyle}
								placeholder={"App ID"}
								underline={false}
								nextRef={this.secretInput}/>
						<Input 	onChangeText={(value)=>this.setState({appSecret:value})}
								value={appSecret}
								placeholderTextColor={Theme['dark'].secondaryText}
								textStyle={styles.textStyle}
								placeholder={"App Secret"}
								secureTextEntry={true}
								underline={false}
								ref={(ref)=>this.secretInput=ref}/>
					</View>
					<View style={styles.buttons}>
						{
							loading?
							<ActivityIndicator color={Theme['dark'].highlighted}/>:
							<Button colors={Theme['dark'].highlightedGrad} 
									text={"Log In"} onPress={this.saveSettings} 
									buttonStyle={styles.button} 
									textStyle={styles.save}/>
						}
					</View>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
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
	renderCreateAccountLink=()=>{
		if ((Platform.OS === 'ios') && !config.testFlight) return <View style={styles.privacyLink}></View>
		return(
               <TouchableOpacity activeOpacity={0.6} style={styles.privacyLink} onPress={()=>openURL('https://www.bitmex.com/register')}>
                   <Text style={styles.privacyLinkText}>
                         Create Bitmex <Text style={[styles.privacyLinkText,styles.highlightedText]}>account</Text>
                   </Text>
               </TouchableOpacity>
			)
	}
	renderPrivacyButton=()=>{
		return(
				<TouchableOpacity activeOpacity={0.6} style={styles.privacyLink} onPress={()=>this.openPolicy()}>
					<Icon name="lock" type="evilicons" color={Theme['dark'].primaryText} size={16}/>
					<Text style={styles.privacyLinkText}>Privacy Policy</Text>
				</TouchableOpacity>
			)
	}
	renderPrivacyStatement=()=>{
		const {privacyPolicyVisible, proceed}=this.state;
		return (
				<Popup visible={privacyPolicyVisible} onClose={this.closePolicy}>
					<View style={styles.dialog}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.dialogContent}>
								<Text style={styles.title}>Liquid</Text>
								{this.renderLongText(privacyPolicy.intro)}
								<Text style={styles.dialogTitle}>Security</Text>
								{this.renderLongText(privacyPolicy.security)}
								<Text style={styles.dialogTitle}>Log Data</Text>
								{this.renderLongText(privacyPolicy.logData)}
							</View>
						</ScrollView>
						<Button text={`Agree & ${proceed?'Continue':'Close'}`} 
								onPress={this.closePolicy} 
								buttonStyle={styles.dialogButton} 
								textStyle={styles.dialogText}/>
					</View>
				</Popup>
			)
	}
	renderInitStatement=()=>{
		const {initStatement, proceed}=this.state;
		return (
				<Popup visible={initStatement} onClose={this.closeInitStatement}>
					<View style={styles.dialog}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.dialogContent}>
								<Text style={styles.title}>Liquid Notifications</Text>
								{this.renderLongText(notifications.usage)}
							</View>
						</ScrollView>
						<Button text={`I understand`} onPress={this.closeInitStatement} buttonStyle={styles.dialogButton} textStyle={styles.dialogText}/>
					</View>
				</Popup>
			)
	}
	renderTakePeek=()=>{
		const {peekBig}=this.state;
		return(
				<TouchableOpacity style={[styles.peek,peekBig?{right:-20}:{}]} onPress={this.openDemo}>
					<Text style={styles.peekText}>Peek</Text>
				</TouchableOpacity>
			)
	}
	renderError=()=>{
        const {error}=this.props.settings;
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
		const {appID, appSecret}=this.state;
		return (
				<View style={styles.container}>
					{this.renderHeader()}
					{this.renderForm()}
					{this.renderCreateAccountLink()}
					{this.renderPrivacyButton()}
					{this.renderPrivacyStatement()}
					{this.renderTakePeek()}
					{this.renderError()}
				</View>
			)
	}
}

const styles={
	container:{
		flex:10,
		flexDirection:'column',
		width:'100%',
		height:'100%',
		alignItems:'center',
		justifyContent:'flex-start'
	},
	notification:{
		zIndex:100,
		elevation:10
	},
	textContainer:{
		width:'100%',
		alignItems:'center',
		justifyContent:'flex-start'
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
		color:Theme['dark'].highlighted
	},
	header:{
		color:Theme['dark'].primaryText,
		fontSize:12,
		width:'80%'
	},
	cover:{
		flex:3,
		width:'100%',
		alignItems:'center',
		justifyContent:'center',
		flexDirection:'column',
		alignSelf:'flex-start'
	},
	row:{
        paddingTop:10,
        paddingBottom:10,
		position:'absolute',
		top:35,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		backgroundColor:Theme['dark'].highlighted,
		width:'100%'
	},
	form:{
		flex:3,
		flexDirection:'column',
		alignSelf:'flex-start',
		justifyContent:'center',
		alignItems:'center',
		width:'100%'
	},
	formOpen:{
		flexDirection:'column',
		alignSelf:'flex-start',
		justifyContent:'flex-start',
		alignItems:'center',
		width:'100%',
		marginBottom:20
	},
	auth:{
		width:'90%',
		alignSelf:'center',
		alignItems:'center',
		justifyContent:'flex-start',
		marginVertical:0,
		paddingVertical:20
	},
	save:{
		fontSize:18,
		fontFamily:Theme['dark'].fontBold
	},
	button:{
		width:'100%',
		height:55,
		paddingHorizontal:0
	},
	buttons:{
		flexDirection:'row',
		aignItems:'center',
		justifyContent:'center',
		width:'80%',
		alignSelf:'center'
	},
	textStyle:{
		color:Theme['dark'].primaryText,
		fontSize:16,
		backgroundColor:Theme['dark'].primary3,
		borderRadius:8,
		paddingHorizontal:20
	},
	logo:{
		width:'50%',
		height:100,
		marginBottom:10
	},
	privacyLink:{
		flex:0.8,
		flexDirection:'row',
		alignItems:'center',
        justifyContent:'center'
	},
	privacyLinkText:{
		fontSize:16,
		marginHorizontal:10,
		color:Theme['dark'].primaryText,
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
	dialogTitle:{
		marginVertical: 10,
		color: Theme['dark'].primaryText,
		fontSize:16,
		fontWeight:'bold',
		alignSelf:'center',
		fontFamily:Theme['dark'].fontBold
	},
	peek:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-start',
		position:'absolute',
		borderRadius:20,
		right:-40,
		top:25,
		backgroundColor: Theme['dark'].highlighted,
		width:80,
		height:40
	},
	peekText:{
		paddingLeft:10,
		color:Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontBold,
		fontSize:12
	}
}

const mapStateToProps=(state)=>{
	return {
		settings:state.settings
	}
}

export default connect(mapStateToProps,{updateAuthSettings, validateAuth})(Login);
