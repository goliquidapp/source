import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Animated, Easing} from 'react-native';
import {Icon} from 'react-native-elements';

import Popup from '../Popup/Popup.component.js';
import Button from '../Button/Button.component.js';

import Theme from '../../resources/Theme.js';
import config from '../../config.js';
import {copyToClipboard} from '../../helpers/text.js';
import {random} from '../../helpers/finance.js';
import {openBitcoinWallet, openEthWallet} from '../../helpers/deeplinking.js';

const BITCOIN_COLOR='#FA1201';
const BIT_COLOR='#f7931a';
const ETH_COLOR=Theme['dark'].highlighted;
const BUBBLES=20;

class DonateButton extends Component{
	constructor(props){
		super(props);
		this.state={popup:false, opacity:new Animated.Value(0.2)};

		this.bubblesAnimatedValuesX=new Array(BUBBLES);
		this.bubblesAnimatedValuesY=new Array(BUBBLES);
		this.bubblesAnimatedValuesOpacity=new Array(BUBBLES);

		for (let i=0; i<BUBBLES; i++){
			this.bubblesAnimatedValuesX[i]=new Animated.Value(0);
			this.bubblesAnimatedValuesY[i]=new Animated.Value(0);
			this.bubblesAnimatedValuesOpacity[i]=new Animated.Value(1);
		}
	}
	componentDidMount(){
		this.animateRipple();
		this.animateBubble();
		this.bubblesInterval=setInterval(this.animateBubble,30*1000);
	}
	componentWillUnmount(){
		clearInterval(this.bubblesInterval)
	}
	closePopup=()=>{
		this.setState({popup:false});
	}
	openPopup=()=>{
		this.setState({popup:true});
	}
	animateBubble=()=>{
		for (let i=0; i<BUBBLES; i++){
			this.bubblesAnimatedValuesX[i]=new Animated.Value(0);
			this.bubblesAnimatedValuesY[i]=new Animated.Value(0);
			this.bubblesAnimatedValuesOpacity[i]=new Animated.Value(1);
		}


		var animationsX=[];
		var animationsY=[];
		var animationsOpacity=[];
		for (let i=0; i<BUBBLES; i++){
			var y=random();
			animationsX.push(
				Animated.timing(this.bubblesAnimatedValuesX[i], {
					toValue: -200,
					easing: Easing.linear(),
					duration: 10000,
					useNativeDriver: true
				})
			)

			animationsY.push(
				Animated.timing(this.bubblesAnimatedValuesY[i], {
					toValue: y,
					easing: Easing.linear(),
					duration: 10000,
					useNativeDriver: true
				})
			)

			animationsX.push(
				Animated.timing(this.bubblesAnimatedValuesOpacity[i], {
					toValue: 0,
					easing: Easing.linear(),
					duration: 8000,
					useNativeDriver: true
				})
			)
		}
		Animated.stagger(100, animationsX).start();
		Animated.stagger(300, animationsY).start();
		Animated.stagger(100, animationsOpacity).start();
	}
	animateRipple=()=>{
		this.setState({
			opacity:new Animated.Value(0.2)
		},()=>{
			Animated.timing(this.state.opacity, {
				toValue: 1,
				easing: Easing.linear(),
				duration: 1000,
				useNativeDriver: true
			}).start(this.revert);
		})
	}
	revert=()=>{
		this.setState({
			opacity:new Animated.Value(1)
		},()=>{
			Animated.timing(this.state.opacity, {
				toValue: 0.2,
				easing: Easing.linear(),
				duration: 1000,
				useNativeDriver: true
			}).start(this.animateRipple);
		})
	}
	renderModal=()=>{
		const {popup}=this.state;
		return (
			<Popup	visible={popup} onClose={this.closePopup}>
				<View style={styles.dialog}>
					<View style={styles.dialogContent}>
						<Text style={styles.title}>Donate</Text>
						<Text style={styles.dialogText}>
							To help us maintain this application, please make a donation.
							We accept both Ethereum and Bitcoin.
						</Text>
						<View style={styles.row}>
							<TouchableOpacity style={styles.addressContainer} onPress={()=>copyToClipboard(config.BITCOIN_ADDR)}>
								<Icon
			                        size={20}
			                        name={'copy'}
			                        type={'feather'}
			                        color={Theme['dark'].highlighted}
			                    />
								<Text style={styles.address}>{config.BITCOIN_ADDR}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>openBitcoinWallet(config.BITCOIN_ADDR)}>
								<Icon name="bitcoin" type="foundation" color={BIT_COLOR} size={18} reverse raised/>
							</TouchableOpacity>
						</View>
						<View style={styles.row}>
							<TouchableOpacity style={styles.addressContainer} onPress={()=>copyToClipboard(config.BITCOIN_ADDR)}>
								<Icon
			                        size={20}
			                        name={'copy'}
			                        type={'feather'}
			                        color={Theme['dark'].highlighted}
			                    />
								<Text style={styles.address}>{config.ETH_ADDR}</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={()=>openEthWallet(config.ETH_ADDR)}>
								<Icon name="ethereum" type="material-community" color={ETH_COLOR} size={18} reverse raised/>
							</TouchableOpacity>
						</View>
					</View>
					<Button text={`Done`} onPress={this.closePopup} buttonStyle={styles.dialogButton} textStyle={styles.textButton}/>
				</View>
			</Popup>
		)
	}
	renderBubbles=()=>{
		const {opacity}=this.state;

		var bubbles=[];
		var customStyle;
		for (let i=0; i<BUBBLES; i++){
			customStyle={
				transform: [{translateX: this.bubblesAnimatedValuesX[i]}, {translateY: this.bubblesAnimatedValuesY[i]}],
				opacity:	this.bubblesAnimatedValuesOpacity[i]
			}
			bubbles.push(
				<Animated.View key={i.toString()} style={[styles.bubble, customStyle]}></Animated.View>
			)
		}
		return (
			bubbles
		)
	}
	render(){
		const {opacity}=this.state;
		const customStyle={
			ripple:{
				opacity
			}
		};
		return (
			<View style={styles.container}>
				{this.renderBubbles()}

				<Animated.View style={[styles.ripple[0], customStyle.ripple]}></Animated.View>
				<Animated.View style={[styles.ripple[1], customStyle.ripple]}></Animated.View>
				<Animated.View style={[styles.ripple[2], customStyle.ripple]}></Animated.View>
				<Animated.View style={[styles.ripple[3], customStyle.ripple]}></Animated.View>
				<TouchableOpacity style={styles.button} onPress={this.openPopup}>
					<Text style={styles.label}>Donate</Text>
					<Icon name="bitcoin" type="foundation" color={Theme['dark'].primaryText} size={22}/>
				</TouchableOpacity>
				{this.renderModal()}
			</View>
		)
	}
}

const styles={
	container:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		marginRight:20,
		marginLeft:20
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
		flexDirection:'column',
		alignSelf:'center',
		alignItems:'flex-start',
		justifyContent:'center',
		paddingTop:20
	},
	button:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		backgroundColor:BITCOIN_COLOR,
		borderRadius:25,
		width:90,
		height:30
	},
	label:{
		color:Theme['dark'].primaryText,
		fontSize:14,
		fontFamily: Theme['dark'].fontBold,
		marginRight:5
	},
	addressContainer:{
		width:'70%',
		flexDirection:'row',
		alignItems:'center'
	},
	address:{
		color: Theme['dark'].primaryText,
		backgroundColor: Theme['dark'].primary2,
		paddingVertical:10,
		paddingHorizontal:15,
		borderRadius:30,
		fontFamily: Theme['dark'].fontFamily,
		fontSize: 12,
		marginLeft:10
	},
	row:{
		width:'100%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		marginBottom:35
	},
	title:{
		color: Theme['dark'].primaryText,
		fontSize:29,
		fontWeight:'bold',
		width:'100%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontBold,
		marginBottom:20
	},
	dialogText:{
		width:'80%',
		alignSelf:'center',
		color: Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal,
		marginBottom:20
	},
	textButton:{
		fontSize: 14,
		fontFamily:Theme['dark'].fontBold,
	},
	dialogButton:{
		marginTop:20,
		width:'60%',
		alignSelf:'center'
	},
	ripple:[
		{
			position:'absolute',
			top:-3,left:-5,
			borderRadius:25,
			backgroundColor:BITCOIN_COLOR+'80',
			width:100,
			height:36
		},
		{
			position:'absolute',
			top:-4,left:-10,
			borderRadius:25,
			backgroundColor:BITCOIN_COLOR+'40',
			width:110,
			height:38
		},
		{
			position:'absolute',
			top:-5,left:-15,
			borderRadius:25,
			backgroundColor:BITCOIN_COLOR+'20',
			width:120,
			height:40
		},
		{
			position:'absolute',
			top:-6,left:-20,
			borderRadius:25,
			backgroundColor:BITCOIN_COLOR+'10',
			width:130,
			height:42
		}
	],
	bubble:{
		position:'absolute',
		width: 10,
		height: 10,
		borderRadius:5,
		backgroundColor: BITCOIN_COLOR,
		zIndex:-1
	}
}

export default DonateButton;