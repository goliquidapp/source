import React, {Component} from 'react';
import {LayoutAnimation, Dimensions, KeyboardAvoidingView, View, Alert, Picker, Text, TouchableOpacity, ActivityIndicator, Keyboard, Platform} from 'react-native';
import { Icon } from 'react-native-elements';
import {AllHtmlEntities} from 'html-entities';
import { connect } from 'react-redux';
import Slider from '@react-native-community/slider';
import * as Animatable from 'react-native-animatable';

import Colors from '../../resources/Colors.js';
import Material from '../../resources/Material.js';
import Theme from '../../resources/Theme.js';

import Input from '../../components/Input/Input.component.js';
import Tag from '../../components/Tag/Tag.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import IconButton from '../../components/IconButton/IconButton.component.js';
import Overlay from '../../components/Overlay/Overlay.component.js';

import Summary from '../Summary/Summary.component.js';

import {getCurrentPrice, placeOrder} from './NewOrder.actions.js';
import {getMyOrders} from '../MyOrders/MyOrders.actions.js';
import {getPosition} from '../Position/Position.actions.js';

import ordTypes from './NewOrder.consts.js';

import { orderBook} from '../../helpers/finance.js';
import NavigationService from '../../helpers/navigate.js';

const HEIGHT=Dimensions.get('window').height
const WIDTH=Dimensions.get('window').width

class NewOrder extends Component{
	constructor(props){
		super(props);
		this.state={
			orderQty:'1', 
			price:'', 
			clOrdID:'', 
			ordType:'Limit',
			stopPx:'',
			currentPrice:0,
			leverage:0,
			timeInForce:'GoodTillCancel',
			pegPriceType:'',
			pegOffsetValue:0.0,
			execInst:'',
			disabledButtons:{buy:false, sell:false},
			keyboardOff:true
		};
		this.moreEqual=new AllHtmlEntities().decode('&#8805');
		this.lessEqual=new AllHtmlEntities().decode('&#8804');

		this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
		this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
		this.keyboardDidShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
		this.keyboardDidHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
	}
	componentDidMount(){
		this.props.getCurrentPrice();
	}
	componentDidUpdate(prevProps){
		if (!this.props.newOrder.loading && prevProps.newOrder.loading){
			const {data}=this.props.newOrder;
			const {sell, buy}=data;
			var price=0;
			if (sell && buy){
				price=buy.price;
			}
			this.setState({price:price||'', currentPrice:price});
		}
		if (!this.props.newOrder.placingOrder && prevProps.newOrder.placingOrder){
			const {error}=this.props.newOrder;
			//if (!error) Alert.alert('Place Order','Order is placed, check "My Orders" window!');
			if (!error){
				NavigationService.navigate('NewOrders');
				this.props.getMyOrders();
				this.props.getPosition();
			}
		}
		if (prevProps.settings.currency.symbolFull!==this.props.settings.currency.symbolFull){
			this.props.getCurrentPrice();
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
		this.setState({keyboardOff:false})
	}
	keyboardWillHide=(event)=>{
		this.setNextTransition();
		this.setState({keyboardOff:true})
	}
	keyboardDidShow=(event)=>{
		this.setNextTransition();
		this.setState({keyboardOff:false})
	}
	keyboardDidHide=(event)=>{
		this.setNextTransition();
		this.setState({keyboardOff:true})
	}
	shapeForm=()=>{
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, timeInForce}=this.state;
		if (!orderQty) 	 return null;
		if (this.props.placingOrder) return null;
		if (ordType==='Limit' && !price) return null;
		if ((ordType==='StopMarket' || ordType==='') && !stopPx) return null;
		if ((ordType==='StopLimit' || ordType==='TakeProfitLimit') && !(stopPx && price)) return null;
		if (ordType==='TrailingStop' && !(pegOffsetValue)) return null;

		switch(ordType){
			case 'Limit':
				return {orderQty, clOrdID, ordType, price, timeInForce}
			case 'Market':
				return {orderQty, clOrdID, ordType}
			case 'StopMarket':
				return {orderQty, clOrdID, ordType:'Stop', stopPx, execInst: "Close,LastPrice"}
			case 'TakeProfitMarket':
				return {orderQty, clOrdID, ordType:'MarketIfTouched', stopPx, execInst: "Close,LastPrice"}
			case 'StopLimit':
				return {orderQty, clOrdID, ordType, price, stopPx, execInst: "Close,LastPrice"}
			case 'TakeProfitLimit':
				return {orderQty, clOrdID, ordType: 'LimitIfTouched', price, stopPx, execInst: "Close,LastPrice"}
			case 'TrailingStop':
				return {orderQty, pegOffsetValue, pegPriceType: 'TrailingStopPeg', ordType:'Stop', execInst: "Close,LastPrice"}
			default:
				return {orderQty, price, clOrdID, ordType}
		}

	}
	onSell=()=>{
		const {leverage}=this.state;
		const {placingOrder}=this.props.newOrder;
		var form=this.shapeForm();
		if (!form || placingOrder) return
		const message='You are about to place an order, continue ?';
		Alert.alert('Place Order',
					message,
					[
						{
							text: 'OK',
							onPress: () => {
								this.props.placeOrder({side:'Sell', leverage,...form});
							}
						},
						{
							text: 'Cancel',
							onPress: () => {}
						}
					])
	}
	onBuy=()=>{
		const {leverage}=this.state;
		const {placingOrder}=this.props.newOrder;
		var form=this.shapeForm();
		if (!form || placingOrder) return
		const message='You are about to place an order, continue ?';
		Alert.alert('Place Order',
					message,
					[
						{
							text: 'OK',
							onPress: () => {
								this.props.placeOrder({side:'Buy', leverage,...form})
							}
						},
						{
							text: 'Cancel',
							onPress: () => {}
						}
					])
	}
	showHelp=()=>{
		const message=ordTypes[this.state.ordType]
		Alert.alert("Help", message)
	}
	showHelpTIF=()=>{
		const message=ordTypes[this.state.timeInForce]
		Alert.alert("Help", message)
	}
	setLeverage=(leverage)=>{
		this.setState({leverage});
	}
	handleFormSelect=(itemValue)=>{
		var disabledButtons={buy:false, sell:false}

		if (itemValue==='TrailingStop' || itemValue==='StopMarket' || itemValue==='StopLimit' || itemValue==='TakeProfitLimit' || itemValue==='TakeProfitMarket'){
			disabledButtons={buy:true, sell:true}
		}
		this.setState({ordType:itemValue, disabledButtons, pegOffsetValue:''})
	}
	renderLeverage2=()=>{
		const {leverage}=this.state;
		return (
				<View style={styles.leverageContainer}>
					<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition}  style={styles.row}>
						<TouchableOpacity style={[styles.point,styles.low,leverage===0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.low,leverage===1.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(1.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.low,leverage===2.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(2.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.mid,leverage===3.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(3.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.mid,leverage===5.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(5.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.mid,leverage===10.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(10.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.high,leverage===25.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(25.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.high,leverage===50.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(50.0)}></TouchableOpacity>
						<TouchableOpacity style={[styles.point,styles.high,leverage===100.0?styles.selectedPoint:{}]} onPress={()=>this.setLeverage(100.0)}></TouchableOpacity>
					</Animatable.View>
					<View style={styles.row}>
						<Text style={styles.label}>{leverage===0.0?'Cross':`${leverage}x`} Leverage</Text>
					</View>
				</View>
				)
	}
	renderLimitForm=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, currentPrice, timeInForce}=this.state;
		return (
			<View>
				<View style={styles.form}>
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderQty:value})}
								value={orderQty.toString()}
								placeholder={"Quantity (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderQty.toString()}
								containerStyle={styles.input}/>

						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({price:value})}
								value={price.toString()}
								placeholder={"Limit Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"decimal-pad"}
								error={!placingOrder.toString()}
								containerStyle={styles.input}/>
					</View>
					<Slider
					    style={{width: 200, height: 50}}
					    minimumValue={currentPrice-215}
					    maximumValue={currentPrice+215}
					    value={currentPrice}
					    step={0.5}
					    onValueChange={(value)=>this.setState({price:value})}
					    minimumTrackTintColor={Theme['dark'].positive}
					    maximumTrackTintColor={Theme['dark'].negative}
					/>
				</View>
				<View style={styles.ordType}>
					<Text style={styles.label}>Time in force</Text>
					<View style={styles.ordTypeRow}>
						<Picker selectedValue={timeInForce}
								style={styles.dropdown}
                				itemStyle={styles.pickerItemStyle}
								onValueChange={(itemValue)=>this.setState({timeInForce:itemValue})}
						>
							<Picker.Item label="GoodTillCancel" 	value="GoodTillCancel" />
							<Picker.Item label="ImmediateOrCancel" 	value="ImmediateOrCancel" />
		  					<Picker.Item label="FillOrKill" 		value="FillOrKill" />
						</Picker>
						<IconButton name="help-circle" type="feather" color={Theme['dark'].secondaryText} size={20} onPress={this.showHelpTIF}/>
					</View>
				</View>
			</View>
			)
	}
	renderMarketForm=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue}=this.state;
		return (
				<View style={styles.form}>
					<Input 	readOnly={placingOrder}
							onChangeText={(value)=>this.setState({orderQty:value})}
							value={orderQty.toString()}
							placeholder={"Quantity (USD)"}
							textStyle={styles.textStyle}
							placeholderTextColor={Theme['dark'].secondaryText}
							keyboardType={"number-pad"}
							error={!orderQty.toString()}/>
				</View>
			)
	}
	renderStopForm=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue}=this.state;
		return (
				<View style={styles.form}>
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderQty:value})}
								value={orderQty.toString()}
								placeholder={"Quantity (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderQty.toString()}
								containerStyle={styles.input}/>

						<Input readOnly={placingOrder}
								onChangeText={(value)=>{
									const {price}=this.state;
									const {realtimeData}=this.props.orderBook;

									const orderPrice=orderBook(realtimeData).sell.min;

									var disabledButtons={buy:false, sell:false};
									if (!value) disabledButtons={buy:true, sell:true};
									else if (value<orderPrice) disabledButtons.buy=true;
									else if (value>orderPrice) disabledButtons.sell=true;
									else if (!value) disabledButtons={buy:true, sell:true};
									else disabledButtons={buy:true, sell:true};

									this.setState({stopPx:value, price:value, disabledButtons})
								}}
								value={stopPx.toString()}
								placeholder={"Stop Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"decimal-pad"}
								error={!stopPx.toString()}
								containerStyle={styles.input}/>
					</View>
				</View>
			)
	}
	renderStopLimitForm=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, currentPrice}=this.state;
		return (
				<View style={styles.form}>
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderQty:value})}
								value={orderQty.toString()}
								placeholder={"Quantity (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderQty.toString()}
								containerStyle={styles.input}/>

						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({price:value})}
								value={price.toString()}
								placeholder={"Limit Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"decimal-pad"}
								error={!placingOrder.toString()}
								containerStyle={styles.input}/>
					</View>
					<Input readOnly={placingOrder}
							onChangeText={(value)=>{
								const {price}=this.state;
								const {realtimeData}=this.props.orderBook;

								const orderPrice=orderBook(realtimeData).sell.min;

								var disabledButtons={buy:false, sell:false};
								if (!value) disabledButtons={buy:true, sell:true};
								else if (value<orderPrice) disabledButtons.buy=true;
								else if (value>orderPrice) disabledButtons.sell=true;
								else if (!value) disabledButtons={buy:true, sell:true};
								else disabledButtons={buy:true, sell:true};

								this.setState({stopPx:value, disabledButtons})
							}}
							value={stopPx.toString()}
							placeholder={"Stop Price (USD)"}
							textStyle={styles.textStyle}
							placeholderTextColor={Theme['dark'].secondaryText}
							keyboardType={"decimal-pad"}
							error={!stopPx.toString()}/>
					<Slider
					    style={{width: 200, height: 50}}
					    minimumValue={currentPrice-215}
					    maximumValue={currentPrice+215}
					    value={currentPrice}
					    step={0.5}
					    onValueChange={(value)=>this.setState({price:value})}
					    minimumTrackTintColor={Theme['dark'].positive}
					    maximumTrackTintColor={Theme['dark'].negative}
					/>
				</View>
			)
	}
	renderTrailingStop=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, pegOffsetValue}=this.state;
		return (
				<View style={styles.form}>
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderQty:value})}
								value={orderQty.toString()}
								placeholder={"Quantity (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderQty.toString()}
								containerStyle={styles.input}/>

						<Input readOnly={placingOrder}
								onChangeText={(value)=>{
									var disabledButtons={buy:false, sell:false};
                
									if (!value) disabledButtons={buy:true, sell:true};
									else if (value<0) disabledButtons.buy=true;
									else if (value>0) disabledButtons.sell=true;
									else if (!value) disabledButtons={buy:true, sell:true};
									else disabledButtons={buy:true, sell:true};

									this.setState({pegOffsetValue:value, disabledButtons})
								}}
								value={pegOffsetValue.toString()}
								placeholder={"Trail Value"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
                                keyboardType={"number-pad"}
                                withMinus={Platform.OS==='ios'?true:false}
								error={!pegOffsetValue.toString()}
								containerStyle={styles.input}/>
					</View>
				</View>
			)
	}
	renderTakeProfitLimit=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, currentPrice}=this.state;
		return (
				<View style={styles.form}>
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderQty:value})}
								value={orderQty.toString()}
								placeholder={"Quantity (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderQty.toString()}
								containerStyle={styles.input}/>

						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({price:value})}
								value={price.toString()}
								placeholder={"Limit Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!placingOrder.toString()}
								containerStyle={styles.input}/>
					</View>
					<Input readOnly={placingOrder}
							onChangeText={(value)=>{
								const {price}=this.state;
								const {realtimeData}=this.props.orderBook;

								const orderPrice=orderBook(realtimeData).sell.min;

								var disabledButtons={buy:false, sell:false};
								if (!value) disabledButtons={buy:true, sell:true};
								else if (value>orderPrice) disabledButtons.buy=true;
								else if (value<orderPrice) disabledButtons.sell=true;
								else disabledButtons={buy:true, sell:true}; 

								this.setState({stopPx:value, disabledButtons})
							}}
							value={stopPx.toString()}
							placeholder={"Trigger Price (USD)"}
							textStyle={styles.textStyle}
							placeholderTextColor={Theme['dark'].secondaryText}
							keyboardType={"number-pad"}
							error={!stopPx.toString()}/>
					<Slider
					    style={{width: 200, height: 50}}
					    minimumValue={currentPrice-215}
					    maximumValue={currentPrice+215}
					    value={currentPrice}
					    step={0.5}
					    onValueChange={(value)=>this.setState({price:value})}
					    minimumTrackTintColor={Theme['dark'].positive}
					    maximumTrackTintColor={Theme['dark'].negative}
					/>
				</View>
			)
	}
	renderTakeProfitMarket=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue}=this.state;
		return (
				<View style={styles.form}>
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderQty:value})}
								value={orderQty.toString()}
								placeholder={"Quantity (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderQty.toString()}
								containerStyle={styles.input}/>

						<Input readOnly={placingOrder}
								onChangeText={(value)=>{
									const {price}=this.state;
									const {realtimeData}=this.props.orderBook;

									const orderPrice=orderBook(realtimeData).sell.min;

									var disabledButtons={buy:false, sell:false};
									if (!value) disabledButtons={buy:true, sell:true};
									else if (value>orderPrice) disabledButtons.buy=true;
									else if (value<orderPrice) disabledButtons.sell=true;
									else if (!value) disabledButtons={buy:true, sell:true};
									else disabledButtons={buy:true, sell:true};

									this.setState({stopPx:value, price:value, disabledButtons})
								}}
								value={stopPx.toString()}
								placeholder={"Trigger Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!stopPx.toString()}
								containerStyle={styles.input}/>
					</View>
				</View>
			)
	}
	renderOverlay=()=>{
		const {placingOrder}=this.props.newOrder;
		return (
			<Overlay visible={placingOrder}>
				<ActivityIndicator size={'small'}/>
			</Overlay>
		)
	}
	renderForm=()=>{
		const {ordType}=this.state;
		const disabledButtons={buy:false, sell:false}

		switch(ordType){
			case 'Limit':
				return this.renderLimitForm()
			case 'Market':
				return this.renderMarketForm()
			case 'StopMarket':
				return this.renderStopForm()
			case 'StopLimit':
				return this.renderStopLimitForm()
			case 'TrailingStop':
				return this.renderTrailingStop()
			case 'TakeProfitLimit':
				return this.renderTakeProfitLimit()
			case 'TakeProfitMarket':
				return this.renderTakeProfitMarket()
			default:
				return this.renderLimitForm()
		}
	}
    renderError=()=>{
        const {error}=this.props.newOrder;
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
            return <ErrorPopup containerStyle={styles.error} message={message}/>
        }
        else{
            return <View></View>
        }
    }
	render(){
		const {realtimeData}=this.props.orderBook;
		const {loading}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, leverage, disabledButtons, keyboardOff, stopPx}=this.state;

		if (ordType==='Market') {
			var buyValue=orderBook(realtimeData).buy.max
			var sellValue=orderBook(realtimeData).sell.min
		}

		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<View style={styles.tagsContainer}>
					<Summary value={(ordType==='Market')?undefined:price}
							 subtitleBuy1={`${orderQty} @ ${(ordType==='StopLimit' || ordType==='TakeProfitLimit')?price:(ordType==='TakeProfitMarket'?'Market':'')}`}
							 subtitleBuy2={`${(ordType==='Market' || ordType==='TrailingStop' || ordType==='StopMarket' || ordType==='StopLimit' || ordType==='TakeProfitLimit' || ordType==='TakeProfitMarket')?((ordType==='TakeProfitMarket' || ordType==='TakeProfitLimit')? this.lessEqual:this.moreEqual):''} ${loading?'-':((ordType==='StopLimit' || ordType==='TakeProfitLimit')?stopPx:((ordType==='Market')? sellValue:price))}`}
							 subtitleSell1={`${orderQty} @ ${(ordType==='StopLimit' || ordType==='TakeProfitLimit')?price:(ordType==='TakeProfitMarket'?'Market':'')}`}
							 subtitleSell2={`${(ordType==='Market' || ordType==='TrailingStop' || ordType==='StopMarket' || ordType==='StopLimit' || ordType==='TakeProfitLimit' || ordType==='TakeProfitMarket')?((ordType==='TakeProfitMarket' || ordType==='TakeProfitLimit')? this.moreEqual:this.lessEqual):''} ${loading?'-':((ordType==='StopLimit' || ordType==='TakeProfitLimit')?stopPx:((ordType==='Market')? buyValue:price))}`}
							 onBuy={this.onBuy}
							 onSell={this.onSell}
							 disabledButtons={disabledButtons}
					/>
				</View>
				{(keyboardOff)&&this.renderLeverage2()}
				{
					(keyboardOff)&&
					<View style={styles.ordType}>
						<Text style={styles.label}>Order Type</Text>
						<View style={styles.ordTypeRow}>
							<Picker selectedValue={ordType}
									style={styles.dropdown}
	                				itemStyle={styles.pickerItemStyle}
									onValueChange={this.handleFormSelect}
							>
								<Picker.Item label="Limit" 			 	value="Limit" />
								<Picker.Item label="Market" 		 	value="Market" />
			  					<Picker.Item label="Stop Market" 	 	value="StopMarket" />
			  					<Picker.Item label="Stop Limit" 	 	value="StopLimit" />
			  					<Picker.Item label="Trailing Stop"   	value="TrailingStop"/>
			  					<Picker.Item label="Take Profit Limit"  value="TakeProfitLimit"/>
			  					<Picker.Item label="Take Profit Market" value="TakeProfitMarket"/>
							</Picker>
							<IconButton name="help-circle" type="feather" color={Theme['dark'].secondaryText} size={20} onPress={this.showHelp}/>
						</View>
					</View>
				}
				{this.renderForm()}
				{this.renderOverlay()}
				{this.renderError()}
			</KeyboardAvoidingView>
		)
	}
}

const styles={
	container:{
		marginVertical:10
	},
	tagsContainer:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around'
	},
	form:{
		alignItems:'center',
		width:'90%',
		alignSelf:'center',
		backgroundColor:Theme['dark'].primary3,
		borderRadius:15,
		paddingTop:10,
		paddingBottom:20,
		marginVertical:10
	},
	ordType:{
		width:'90%',
		alignSelf:'center',
		backgroundColor:Theme['dark'].primary3,
		borderRadius:15,
		paddingVertical:10,
		paddingHorizontal:10,
		alignItems:'center'
	},
	ordTypeRow:{
		width:'90%',
		flexDirection:'row',
		justifyContent:'space-between',
		alignItems:'center'
	},
	dropdown:{
		width:'90%',
		color: Theme['dark'].primaryText
	},
	label:{
		alignSelf:'flex-start',
		marginLeft:10,
		color:Theme['dark'].secondaryText,
		fontFamily:Theme['dark'].fontNormal
	},
	textStyle:{
		color:Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontNormal
	},
    pickerItemStyle:{
        color:Theme['dark'].primaryText,
        height:100,
        fontSize:14,
        fontFamily:Theme['dark'].fontNormal
    },
    row:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		alignSelf:'center',
		padding:10
	},
	leverageContainer:{
		backgroundColor:Theme['dark'].primary1,
		width:'85%',
		alignSelf:'center',
		borderRadius:20,
		marginBottom:20
	},
	point:{
		width:20,
		height:20,
		borderRadius:10,
		elevation:5,
		backgroundColor:Colors['White']
	},
	low:{
		backgroundColor:Theme['dark'].positive
	},
	mid:{
		backgroundColor:Theme['dark'].warning
	},
	high:{
		backgroundColor:Theme['dark'].negative
	},
	selectedPoint:{
		width:24,
		height:24,
		borderRadius:12,
		borderWidth:4,
		borderColor:Theme['dark'].primaryText
	},
	input:{
		width:'46%'
	},
	error:{
		bottom:'auto',
		top:0.7*HEIGHT
	}
}

const mapStateToProps=(state)=>{
	return {
		newOrder:state.newOrder,
		orderBook:state.orderBook,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{getCurrentPrice, placeOrder, getMyOrders, getPosition})(NewOrder);
