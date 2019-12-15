import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, ActivityIndicator, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import {round} from '../../helpers/finance.js';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import Overlay from '../../components/Overlay/Overlay.component.js';
import Button from '../../components/Button/Button.component.js';
import Input from '../../components/Input/Input.component.js';
import Popup from '../../components/Popup/Popup.component.js';

import { subscribe, updateLeverage, closePosition, getPosition } from './Position.actions.js';

const HEIGHT=Dimensions.get('window').height
const WIDTH=Dimensions.get('window').width

class Position extends Component{
	state={showPopup:false,price:null, index:0}
	componentDidMount(){
		this.props.subscribe();
		this.props.getPosition();
	}
	setLeverage=(value,index)=>{
		const {realtimeData}=this.props.position;
		this.props.updateLeverage(value, realtimeData[index].symbol);
	}
	closePosition=(index)=>{
		const {realtimeData}=this.props.position;
		var markPrice=realtimeData[index].markPrice;
		markPrice=markPrice.toFixed(2)<0.05?markPrice:markPrice.toFixed(2);

		this.setState({showPopup:true, markPrice:markPrice.toString(), index})
	}
	renderPosition=()=>{
		const {loading, realtimeData, error, loadingLeverage}=this.props.position;
		if (loading)
			return (<ActivityIndicator size={'small'}/>)
		else if (realtimeData.length===0){
			return (
				<View style={styles.row}>
					<Text style={styles.value}>No open positions</Text>
				</View>
				)
		}
		else{
			var positions=[];
			positions=realtimeData.map((position, index)=>{
				if (!position.isOpen){
					return(
							<View style={styles.row} key={index.toString()} style={styles.position}>
								<Text style={styles.subtitle}>{position.underlying}</Text>
								<Text style={styles.value}>No open positions</Text>
							</View>
						)
				}else{
					return (
						<View key={index.toString()} style={styles.position}>
							<View style={styles.row}>
								<Text style={styles.subtitle}>{position.underlying}</Text>
							</View>
							<View style={styles.row}>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"Entry Price"}
									</Text>
									<Text style={styles.value}>
										{position.avgEntryPrice?(position.avgEntryPrice.toFixed(2)<0.05?position.avgEntryPrice:position.avgEntryPrice.toFixed(2)):'-'}
									</Text>
								</View>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"Mark Price"}
									</Text>
									<Text style={styles.value}>
										{position.markPrice?(position.markPrice.toFixed(2)<0.05?position.markPrice:position.markPrice.toFixed(2)):'-'}
									</Text>
								</View>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"Liq Price"}
									</Text>
									<Text style={styles.value}>
										{position.liquidationPrice?(position.liquidationPrice.toFixed(2)<0.05?position.liquidationPrice:position.liquidationPrice.toFixed(2)):'-'}
									</Text>
								</View>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"Leverage"}
									</Text>
									{
										loadingLeverage?
										<ActivityIndicator size={"small"}/>:
										<Text style={styles.value}>
											{position.crossMargin?("Cross"):position.leverage.toFixed(2)}
										</Text>
									}
								</View>
							</View>
							<View style={styles.row}>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"Contracts"}
									</Text>
									<Text style={[styles.value,position.currentQty<0?styles.negative:styles.positive]}>
										{position.currentQty?position.currentQty.toFixed(0):'-'}
									</Text>
								</View>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"ROE"}
									</Text>
									<Text style={[styles.value,position.unrealisedRoePcnt<0?styles.negative:styles.positive]}>
										{position.unrealisedRoePcnt?(position.unrealisedRoePcnt*100).toFixed(2):'-'}%
									</Text>
								</View>
								<View style={styles.column}>
									<Text style={styles.label}>
										{"PNL"}
									</Text>
									<Text style={[styles.value,position.unrealisedPnl<0?styles.negative:styles.positive]}>
										{position.unrealisedPnl?(position.unrealisedPnl/1e8).toFixed(4):'-'}
									</Text>
								</View>
							</View>
							{this.renderLeverage2(index)}
							{this.renderClosePosition(index)}
						</View>
					)
				}
			})
			return (
				<ScrollView  scrollEnabled
							 horizontal={true}
							 pagingEnabled={true}
							 showsHorizontalScrollIndicator={false}
							 directionalLockEnabled={true}
							 nestedScrollEnabled={true}>
					{positions}
				</ScrollView>
			)
		}
	}
	renderLeverage=()=>{
		const {loading, realtimeData, error, loadingLeverage}=this.props.position;
		if (loading)
			return (<View></View>)
		else if (realtimeData.length===0){
			return <View></View>
		}
		else if (!realtimeData[0].isOpen){
			return <View></View>
		}
		else{
			var {leverage, crossMargin, maintMargin}=realtimeData[0]

			return(
				<View style={styles.column}>
					<LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={[Theme['dark'].positive,  Theme['dark'].negative]} style={styles.leverage}>
						<View style={styles.labelsContainer}>
							<Text style={[styles.leverageLabel,crossMargin?styles.show:styles.hide]}>{(maintMargin/1e5).toFixed(2)}x</Text>
							<Text style={[styles.leverageLabel,leverage===1.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,leverage===2.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,leverage===3.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,leverage===5.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,leverage===10.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,leverage===25.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,leverage===50.0?styles.show:styles.hide]}>{leverage}x</Text>
							<Text style={[styles.leverageLabel,(!crossMargin&&leverage===100.0)?styles.show:styles.hide]}>{leverage}x</Text>
						</View>
					</LinearGradient>
					<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition} style={styles.slider}>
						<View style={styles.pointsContainer}>
							<TouchableOpacity style={[styles.point,crossMargin?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===1.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(1.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===2.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(2.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===3.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(3.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===5.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(5.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===10.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(10.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===25.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(25.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,leverage===50.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(50.0)}></TouchableOpacity>
							<TouchableOpacity style={[styles.point,(!crossMargin&&leverage===100.0)?styles.selectedPoint:{}]}
											  onPress={()=>this.setLeverage(100.0)}></TouchableOpacity>
						</View>
					</Animatable.View>
					<View style={styles.row}>
						<Text style={crossMargin?styles.leverageLabel:styles.label}>Cross</Text>
						<Text style={leverage===1.0?styles.leverageLabel:styles.label}>1x</Text>
						<Text style={leverage===2.0?styles.leverageLabel:styles.label}>2x</Text>
						<Text style={leverage===3.0?styles.leverageLabel:styles.label}>3x</Text>
						<Text style={leverage===5.0?styles.leverageLabel:styles.label}>5x</Text>
						<Text style={leverage===10.0?styles.leverageLabel:styles.label}>10x</Text>
						<Text style={leverage===25.0?styles.leverageLabel:styles.label}>25x</Text>
						<Text style={leverage===50.0?styles.leverageLabel:styles.label}>50x</Text>
						<Text style={(!crossMargin&&leverage===100.0)?styles.leverageLabel:styles.label}>100x</Text>
					</View>
				</View>
			)
		}
	}
	renderLeverage2=(index=0)=>{
		const {loading, realtimeData, error, loadingLeverage}=this.props.position;
		if (loading)
			return (<View></View>)
		else if (realtimeData.length===0){
			return <View></View>
		}
		else if (!realtimeData[index].isOpen){
			return <View></View>
		}
		else{
			var {leverage, crossMargin, maintMargin}=realtimeData[index]
			return (
					<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition}  style={[styles.row,styles.leverageContainer]}>
						<TouchableOpacity style={[styles.point,styles.low,crossMargin?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.low,leverage===1.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(1.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.low,leverage===2.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(2.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.mid,leverage===3.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(3.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.mid,leverage===5.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(5.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.mid,leverage===10.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(10.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.high,leverage===25.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(25.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.high,(!crossMargin&&leverage===50.0)?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(50.0,index)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.high,(!crossMargin&&leverage===100.0)?styles.selectedPoint:{}]}
										  onPress={()=>this.setLeverage(100.0,index)}></TouchableOpacity>
					</Animatable.View>
				)
		}
	}
	renderClosePosition=(index=0)=>{
		const {loading, realtimeData, error, loadingLeverage}=this.props.position;
		if (loading)
			return (<View></View>)
		else if (realtimeData.length===0){
			return <View></View>
		}
		else if (!realtimeData[index].isOpen){
			return <View></View>
		}
		else{
			return(
				<View style={styles.row}>
					<Button onPress={()=>this.closePosition(index)} buttonStyle={styles.button} textStyle={styles.buttonTextStyle} text={"Close Position"}/>
				</View>
			)
		}
	}
	renderPopup=()=>{
		const {showPopup, price, markPrice, index}=this.state;
		const {	realtimeData } = this.props.position;

		return (
				<Popup visible={showPopup} onClose={()=>this.setState({showPopup:false})}>
					<View style={styles.form}>
						<Text 	style={styles.title}>Close Position</Text>
						<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition*2} style={[styles.row,styles.notification]}>
							<Icon name="info" type="feather" size={20} color={Theme['dark'].primaryText}/>
							<Text style={styles.notificationText}>
								Leave empty to close at <Text style={styles.boldText}>{markPrice}</Text>
							</Text>
						</Animatable.View>
						<Input  textStyle={styles.textStyle} 
								keyboardType={"number-pad"} 
								placeholder={"Limit Price (Optional)"}
								placeholderTextColor={Theme['dark'].secondaryText}
								value={price}
								onChangeText={(value)=>this.setState({price:value})}/>
						<View style={styles.row}>
							<Button buttonStyle={styles.button} 
									textStyle={styles.buttonTextStyle}
									text={"Submit"}
									onPress={()=>{
										this.props.closePosition(price,realtimeData[index].symbol);
										this.setState({showPopup:false});
									}}/>
							<Button buttonStyle={styles.buttonCancel} 
									textStyle={styles.buttonCancel} 
									text={"Cancel"}
									onPress={()=>this.setState({showPopup:false})}/>
						</View>
					</View>
				</Popup>
			)
	}
	renderTitle=()=>{
		return (
				<View style={styles.row}>
					<Text style={styles.title}>{"Position"}</Text>
				</View>
			)
	}
	renderOverlay=()=>{
		const {closingPosition}=this.props.position;
		return (
			<Overlay visible={closingPosition}>
				<ActivityIndicator size={'small'}/>
			</Overlay>
		)
	}
	renderError=()=>{
        const {error}=this.props.position;
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
		const {loading, realtimeData, error}=this.props.position;
		return (
			<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition} style={styles.container}>
				{this.renderTitle()}
				{this.renderPosition()}
				{this.renderPopup()}
				{this.renderOverlay()}
				{this.renderError()}
			</Animatable.View>
		)
	}
}

const styles={
	container:{
		marginVertical:20,
		width:'90%',
		alignSelf:'center',
		borderRadius:8,
		paddingVertical:10,
		backgroundColor:Theme['dark'].primary3
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
	label:{
		color:Theme['dark'].primaryText,
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal
	},
	value:{
		color:Theme['dark'].highlighted,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	leverageContainer:{
		backgroundColor:Theme['dark'].primary1,
		width:'85%',
		alignSelf:'center',
		borderRadius:20
	},
	title:{
		alignSelf:'center',
		marginLeft:'auto',
		marginRight:'auto',
		color:Theme['dark'].primaryText,
		fontSize:18,
		fontFamily:Theme['dark'].fontBold
	},
	negative:{
		color: Theme['dark'].negative,
		fontFamily:Theme['dark'].fontNormal
	},
	positive:{
		color: Theme['dark'].positive,
		fontFamily:Theme['dark'].fontNormal
	},
	leverage:{
		borderRadius:10,
		marginTop:10,
		alignSelf:'center',
		width:'90%',
		height:20
	},
	pointsContainer:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		zIndex:1,
		position:'absolute',
		top:-5
	},
	labelsContainer:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'95%',
		zIndex:1,
		position:'absolute',
		top:0
	},
	leverageLabel:{
		fontSize:12,
		color:Colors['White'],
		fontFamily:Theme['dark'].fontNormal
	},
	point:{
		width:20,
		height:20,
		borderRadius:10,
		elevation:5,
		backgroundColor:Colors['White']
	},
	low:{
		backgroundColor:Theme['dark'].positive,
		fontFamily:Theme['dark'].fontNormal
	},
	mid:{
		backgroundColor:Theme['dark'].warning,
		fontFamily:Theme['dark'].fontNormal
	},
	high:{
		backgroundColor:Theme['dark'].negative,
		fontFamily:Theme['dark'].fontNormal
	},
	selectedPoint:{
		width:24,
		height:24,
		borderRadius:12,
		borderWidth:4,
		borderColor:Theme['dark'].primaryText
	},
	slider:{
		borderRadius:10,
		marginTop:10,
		flexDirection:'row',
		width:'85%',
		height:6,
		backgroundColor:Theme['dark'].primaryText
	},
	show:{
		opacity:1
	},
	hide:{
		opacity:0
	},
	button:{
		backgroundColor:Theme['dark'].negative
	},
	buttonCancel:{
		backgroundColor:Colors['Concrete'],
		color:Colors['Black'],
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	buttonTextStyle:{
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	form:{
		borderRadius:10,
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'space-around',
		padding:20,
		width:'100%',
		height:300,
		marginLeft:'auto',
		marginRight:'auto',
		backgroundColor:Theme['dark'].disabled
	},
	textStyle:{
		color:Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	},
	notification:{
		zIndex:100,
		elevation:10,
		backgroundColor:Theme['dark'].highlighted,
		marginTop:20,
		width:'100%'
	},
	notificationText:{
		color:Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontNormal
	},
	boldText:{
		fontFamily:Theme['dark'].fontBold,
		fontWeight:'bold',
		color:Theme['dark'].warning
	},
	position:{
		width:0.9*WIDTH,
		alignItems:'center',
		justifyContent:'center'
	},
	subtitle:{
		color:Theme['dark'].secondaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal
	}
}

const mapStateToProps=(state)=>{
	return {
		position:state.position
	}
}
export default connect(mapStateToProps,{subscribe, updateLeverage, closePosition, getPosition})(Position);
