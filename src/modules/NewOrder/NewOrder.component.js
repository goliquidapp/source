import React, {Component} from 'react';
import {LayoutAnimation, Dimensions, KeyboardAvoidingView, 
		View, Alert, Picker, Text, TouchableOpacity, 
		ActivityIndicator, Keyboard, Platform,
		ScrollView } from 'react-native';

import { Switch, Checkbox } from 'react-native-paper';

import { Icon } from 'react-native-elements';
import {AllHtmlEntities} from 'html-entities';
import { connect } from 'react-redux';
import Slider from '@react-native-community/slider';
import * as Animatable from 'react-native-animatable';
import {KeyboardAccessoryView} from 'react-native-keyboard-input';

import Colors from '../../resources/Colors.js';
import Material from '../../resources/Material.js';
import Theme from '../../resources/Theme.js';

import Input from '../../components/Input/Input.component.js';
import Tag from '../../components/Tag/Tag.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import IconButton from '../../components/IconButton/IconButton.component.js';
import Overlay from '../../components/Overlay/Overlay.component.js';
import CustomKeyboard from '../../components/CustomKeyboard/CustomKeyboard.component.js';
import Popup from '../../components/Popup/Popup.component.js';
import Button from '../../components/Button/Button.component.js';

import Summary from '../Summary/Summary.component.js';

import {getCurrentPrice, placeOrder, placeOrderBulk} from './NewOrder.actions.js';
import {getMyOrders} from '../MyOrders/MyOrders.actions.js';
import {getPosition} from '../Position/Position.actions.js';

import ordTypes from './NewOrder.consts.js';

import { orderBook} from '../../helpers/finance.js';
import NavigationService from '../../helpers/navigate.js';

import {orderBulk} from './Distributions.ts';

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
			closeOnTrigger:true,
			disabledButtons:{buy:false, sell:false},
			keyboardOff:true,
            keyboard:'',
            distribution:'Uniform',
            orderCount:10,
            allContractsCount:'',
            apart:'',
            rangeStart:'',
            rangeEnd:'',
            useApart:true,
            scaledOrdersPopup:false,
            scaledOrders:[]
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
	onKeyboardItemSelected=(keyboardId, params)=>{
        const {value}=params;
        var disabledButtons={buy:false, sell:false};
        
        if (!value) disabledButtons={buy:true, sell:true};
        else if (value<0) disabledButtons.buy=true;
        else if (value>0) disabledButtons.sell=true;
        else if (!value) disabledButtons={buy:true, sell:true};
        else disabledButtons={buy:true, sell:true};
        
        this.setState({pegOffsetValue:value, disabledButtons})
    }
    showScaledOrders=(scaledOrders)=>{
    	let avgScaledOrders=0;
    	scaledOrders.orders.map((order)=>avgScaledOrders+=order.price);
    	avgScaledOrders=(avgScaledOrders/(scaledOrders.orders.length)).toFixed(2);

    	this.setState({scaledOrdersPopup:true,scaledOrders, avgScaledOrders})
    }
    closeScaledOrders=()=>{
		this.setState({scaledOrdersPopup:false,scaledOrders:[]})
    }
    submitScaleOrders=()=>{
    	const {scaledOrders, leverage}=this.state;

    	this.props.placeOrderBulk(scaledOrders, leverage)
    	this.closeScaledOrders();
    }
    getBuyPrice=()=>{
    	const {realtimeData}=this.props.orderBook;
    	const buyValue=orderBook(realtimeData).buy.max
    	return buyValue
    }
	shapeForm=()=>{
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, timeInForce, closeOnTrigger}=this.state;
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
				return {orderQty, clOrdID, ordType:'Stop', stopPx, execInst: `${closeOnTrigger?'Close,':''}LastPrice`}
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
	generateScaledOrders=(side)=>{
		const {distribution, apart, orderCount, useApart, allContractsCount}=this.state;
		const {symbolFull}=this.props.settings.currency;
		const {realtimeData}=this.props.orderBook;
		
		let rangeStart;
		let rangeEnd;
		let orders;

		if (useApart){
			if (!distribution || !apart || !allContractsCount || !orderCount) return;

			const buyValue=orderBook(realtimeData).buy.max
			const sellValue=orderBook(realtimeData).sell.min

			if (side==='Buy'){
				rangeStart=sellValue-parseFloat(apart);
				rangeEnd=sellValue-(parseFloat(apart)*parseFloat(orderCount));
			}
			else if (side==='Sell'){
				rangeStart=buyValue+parseFloat(apart);
				rangeEnd=buyValue+(parseFloat(apart)*parseFloat(orderCount));
			}

			orders=orderBulk({
				quantity:allContractsCount, 
				n_tp:parseInt(orderCount), 
				start:rangeStart, 
				end:rangeEnd, 
				side, 
				distribution, 
				symbol:symbolFull
			});
		}else{
			rangeStart=this.state.rangeStart;
			rangeEnd=this.state.rangeEnd;

			if (!distribution || !rangeStart || !rangeEnd || !allContractsCount || !orderCount) return;

			if (rangeStart>rangeEnd) return;

			orders=orderBulk({
				quantity:allContractsCount, 
				n_tp:parseInt(orderCount), 
				start:parseInt(rangeStart), 
				end:parseInt(rangeEnd), 
				side, 
				distribution, 
				symbol:symbolFull
			});

		}

		if (orders.length===0) return;

		const message="You are about to make Scale Order(s),please review these orders and then submit.\n\nContinue to orders review?"
		Alert.alert('Place Order',
					message,
					[
						{
							text:	'Continue',
							onPress: ()=>this.showScaledOrders(orders)
						},
						{
							text:	'Cancel',
							onPress: ()=>{}
						}
					])


	}
	onSell=()=>{
		const {leverage, ordType}=this.state;
		const {placingOrder}=this.props.newOrder;
		if (ordType==='ScaleOrder') this.generateScaledOrders('Sell');
		else {
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
	}
	onBuy=()=>{
		const {leverage, ordType}=this.state;
		const {placingOrder}=this.props.newOrder;
		if (ordType==='ScaleOrder') this.generateScaledOrders('Buy');
		else{
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
	}
	showHelp=()=>{
		const message=ordTypes[this.state.ordType]
		Alert.alert("Help", message)
	}
	showHelpTIF=()=>{
		const message=ordTypes[this.state.timeInForce]
		Alert.alert("Help", message)
	}
	showHelpSOD=()=>{
		const message=ordTypes[this.state.distribution]
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
	renderScaledOrdersReview=()=>{
		const {scaledOrders, scaledOrdersPopup, avgScaledOrders}=this.state;
		return (
			<Popup	visible={scaledOrdersPopup}
					onClose={this.closeScaledOrders}>
				<View style={styles.dialog}>
					<ScrollView>
						<View style={styles.dialogContent}>
							<Text style={styles.title}>Scale Orders Review</Text>
							<View style={styles.column}>
								<View style={styles.row}>
									<Text style={[styles.textStyle, styles.rowItem]}>Side</Text>
									<Text style={[styles.textStyle, styles.rowItem]}>Order Qty</Text>
									<Text style={[styles.textStyle, styles.rowItem]}>Price</Text>
								</View>
								{
									scaledOrders.orders.map((order,i)=>
										<View key={i.toString()} style={styles.row}>
											<Text style={[styles.textStyle, styles.side[order.side], styles.rowItem]}>{order.side}</Text>
											<Text style={[styles.textStyle, styles.rowItem]}>{order.orderQty}</Text>
											<Text style={[styles.textStyle, styles.rowItem]}>{order.price}</Text>
										</View>
									)
								}
							</View>
						</View>
					</ScrollView>
					<View style={styles.column}>
						<View style={styles.rowLine}>
							<Text style={styles.label}>Average Price: <Text style={styles.average}>{avgScaledOrders}</Text></Text>
						</View>
						<Button text={`Confirm`} onPress={this.submitScaleOrders} buttonStyle={styles.dialogButton} textStyle={styles.textButton}/>
						<Button text={`Cancel`} onPress={this.closeScaledOrders} buttonStyle={styles.dialogCancelButton} textStyle={styles.textCancelButton}/>
					</View>
				</View>
			</Popup>
		)
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
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, currentPrice, timeInForce, keyboardOff}=this.state;
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
								counter={keyboardOff}
								autofill={(keyboardOff)?this.getBuyPrice:undefined}
								autofillIcon={{name:"usd",type:"font-awesome"}}
								placeholder={"Limit Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"decimal-pad"}
								error={!placingOrder.toString()}
								containerStyle={styles.input}/>
					</View>
					<View style={styles.row}>
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
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, keyboardOff, closeOnTrigger}=this.state;
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
								counter={keyboardOff}
								autofill={(keyboardOff)?this.getBuyPrice:undefined}
								autofillIcon={{name:"usd",type:"font-awesome"}}
								value={stopPx.toString()}
								placeholder={"Stop Price (USD)"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"decimal-pad"}
								error={!stopPx.toString()}
								containerStyle={styles.input}/>
					</View>
					<View style={styles.optionForm}>
						<Text style={styles.switchLabel}>Close on Trigger</Text>
						<Checkbox status={closeOnTrigger ? 'checked' : 'unchecked'}
								  onPress={() => { this.setState({ closeOnTrigger: !closeOnTrigger }); }}
                                  color={Theme['dark'].highlighted}
                                  uncheckedColor={Theme['dark'].secondaryText}/>
					</View>
				</View>
			)
	}
	renderStopLimitForm=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, currentPrice, keyboardOff}=this.state;
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
					<Input 	readOnly={placingOrder}
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
							counter={keyboardOff}
							autofill={(keyboardOff)?this.getBuyPrice:undefined}
							autofillIcon={{name:"usd",type:"font-awesome"}}
							textStyle={styles.textStyle}
							placeholderTextColor={Theme['dark'].secondaryText}
							keyboardType={"decimal-pad"}
							error={!stopPx.toString()}/>
					<View style={styles.row}>
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
                                withMinus={Platform.OS==='ios'?false:false}
                                error={!pegOffsetValue.toString()}
                                containerStyle={styles.input}
                                ref={(ref) => this.textInputRef = ref}
                                onFocus={()=>this.setState({keyboard:'CustomKeyboard'})}
                                onClickOutside={()=>this.setState({keyboard:''})}/>
					</View>
				</View>
			)
	}
	renderTakeProfitLimit=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, currentPrice, keyboardOff}=this.state;
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
							counter={keyboardOff}
							autofill={(keyboardOff)?this.getBuyPrice:undefined}
							autofillIcon={{name:"usd",type:"font-awesome"}}
							textStyle={styles.textStyle}
							placeholderTextColor={Theme['dark'].secondaryText}
							keyboardType={"number-pad"}
							error={!stopPx.toString()}/>
					<View style={styles.row}>
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
				</View>
			)
	}
	renderTakeProfitMarket=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {orderQty, price, clOrdID, ordType, stopPx, pegOffsetValue, keyboardOff}=this.state;
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

						<Input  readOnly={placingOrder}
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
								counter={keyboardOff}
								autofill={(keyboardOff)?this.getBuyPrice:undefined}
								autofillIcon={{name:"usd",type:"font-awesome"}}
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
	renderScaleOrder=()=>{
		const {loading, data, placingOrder}=this.props.newOrder;
		const {
			orderCount, 
			apart, useApart,
			rangeStart, rangeEnd,
			allContractsCount,
			distribution, scaledOrdersPopup, keyboardOff}=this.state;

		return (
			<View>
				<View style={styles.form}>
					{
						(keyboardOff)&&
						<View style={styles.row}>
							<Text style={styles.switchLabel}>Use Apart instead of manual price range</Text>
							<Switch value={this.state.useApart}
	                                onValueChange={()=>this.setState({useApart:!useApart})}
	                                color={Theme['dark'].highlighted}/>
						</View>
					}
					<View style={styles.row}>
						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({allContractsCount:value})}
								value={allContractsCount.toString()}
								placeholder={"All Contracts Count"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!allContractsCount.toString()}
								containerStyle={styles.input}/>

						<Input 	readOnly={placingOrder}
								onChangeText={(value)=>this.setState({orderCount:value})}
								value={orderCount.toString()}
								placeholder={"Order Count"}
								textStyle={styles.textStyle}
								placeholderTextColor={Theme['dark'].secondaryText}
								keyboardType={"number-pad"}
								error={!orderCount.toString()}
								containerStyle={styles.input}/>
					</View>
					{
						useApart?
						<View style={styles.row}>
							<Input 	readOnly={placingOrder}
									onChangeText={(value)=>this.setState({apart:value})}
									value={apart.toString()}
									placeholder={"Apart"}
									textStyle={styles.textStyle}
									placeholderTextColor={Theme['dark'].secondaryText}
									keyboardType={"decimal-pad"}
									error={(!apart.toString()||apart<=0)}/>
						</View>:
						<View style={styles.row}>
	                        <Input 	readOnly={placingOrder}
									onChangeText={(value)=>this.setState({rangeStart:value})}
									value={rangeStart.toString()}
									counter={keyboardOff}
									autofill={(keyboardOff)?this.getBuyPrice:undefined}
									autofillIcon={{name:"usd",type:"font-awesome"}}
									placeholder={"Range Start (USD)"}
									textStyle={styles.textStyle}
									placeholderTextColor={Theme['dark'].secondaryText}
									keyboardType={"number-pad"}
									error={(!rangeStart.toString())||(rangeStart>rangeEnd)}
									containerStyle={styles.input}/>

							<Input 	readOnly={placingOrder}
									onChangeText={(value)=>this.setState({rangeEnd:value})}
									counter={keyboardOff}
									autofill={(keyboardOff)?this.getBuyPrice:undefined}
									autofillIcon={{name:"usd",type:"font-awesome"}}
									value={rangeEnd.toString()}
									placeholder={"Range End (USD)"}
									textStyle={styles.textStyle}
									placeholderTextColor={Theme['dark'].secondaryText}
									keyboardType={"decimal-pad"}
									error={(!rangeEnd.toString())||(rangeStart>rangeEnd)}
									containerStyle={styles.input}/>
						</View>
					}
				</View>
				<View style={styles.ordType}>
					<Text style={styles.label}>Distribution</Text>
					<View style={styles.ordTypeRow}>
						<Picker selectedValue={distribution}
								style={styles.dropdown}
                				itemStyle={styles.pickerItemStyle}
								onValueChange={(itemValue)=>this.setState({distribution:itemValue})}
						>
							<Picker.Item label="Uniform" 	value="Uniform" />
							<Picker.Item label="Normal" 	value="Normal" />
		  					<Picker.Item label="Positive" 	value="Positive" />
		  					<Picker.Item label="Negative" 	value="Negative" />
						</Picker>
						<IconButton name="help-circle" type="feather" color={Theme['dark'].secondaryText} size={20} onPress={this.showHelpSOD}/>
					</View>
				</View>
				{scaledOrdersPopup&&this.renderScaledOrdersReview()}
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
			case 'ScaleOrder':
				return this.renderScaleOrder()
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

		if (ordType==='Market' || ordType==='TrailingStop') {
			var buyValue=orderBook(realtimeData).buy.max
			var sellValue=orderBook(realtimeData).sell.min
		}

		return (
			<KeyboardAvoidingView style={styles.container} behavior="padding">
				<View style={styles.tagsContainer}>
					<Summary value={(ordType==='Market')?undefined:price}
							 subtitleBuy1={`${orderQty} @ ${(ordType==='StopLimit' || ordType==='TakeProfitLimit')?price:(ordType==='TakeProfitMarket'?'Market':'')}`}
							 subtitleBuy2={`${(ordType==='Market' || ordType==='TrailingStop' || ordType==='StopMarket' || ordType==='StopLimit' || ordType==='TakeProfitLimit' || ordType==='TakeProfitMarket')?((ordType==='TakeProfitMarket' || ordType==='TakeProfitLimit')? this.lessEqual:this.moreEqual):''} ${loading?'-':((ordType==='StopLimit' || ordType==='TakeProfitLimit')?stopPx:((ordType==='Market' || ordType==='TrailingStop')? sellValue:price))}`}
							 subtitleSell1={`${orderQty} @ ${(ordType==='StopLimit' || ordType==='TakeProfitLimit')?price:(ordType==='TakeProfitMarket'?'Market':'')}`}
							 subtitleSell2={`${(ordType==='Market' || ordType==='TrailingStop' || ordType==='StopMarket' || ordType==='StopLimit' || ordType==='TakeProfitLimit' || ordType==='TakeProfitMarket')?((ordType==='TakeProfitMarket' || ordType==='TakeProfitLimit')? this.moreEqual:this.lessEqual):''} ${loading?'-':((ordType==='StopLimit' || ordType==='TakeProfitLimit')?stopPx:((ordType==='Market' || ordType==='TrailingStop')? buyValue:price))}`}
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
			  					<Picker.Item label="Scale Order" 		value="ScaleOrder"/>
							</Picker>
							<IconButton name="help-circle" type="feather" color={Theme['dark'].secondaryText} size={20} onPress={this.showHelp}/>
						</View>
					</View>
				}
				{this.renderForm()}
				{this.renderOverlay()}
				{this.renderError()}
				{
					(Platform.OS === 'ios')&&
	                <KeyboardAccessoryView
	                    kbInputRef={this.textInputRef}
	                    kbComponent={this.state.keyboard}
	                    onItemSelected={this.onKeyboardItemSelected}
	                    onKeyboardResigned={()=>this.setState({keyboard:''})}
	                    revealKeyboardInteractive/>
                }
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
		alignItems:'center',
		marginVertical:10
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
	switchLabel:{
	    alignSelf:'center',
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
    column:{
    	flexDirection:'column',
    	alignItems:'center',
    	justifyContent:'center'
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
	},
	dialog:{
		width:'100%',
		height:'100%',
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
	title:{
		color: Theme['dark'].primaryText,
		fontSize:29,
		fontWeight:'bold',
		width:'100%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontBold,
		marginBottom:20
	},
	side:{
		Buy:{
			color:Theme['dark'].positive
		},
		Sell:{
			color:Theme['dark'].negative
		}
	},
	textButton:{
		fontSize: 14,
		fontFamily:Theme['dark'].fontBold,
	},
	dialogButton:{
		marginTop:20,
		width:'80%',
		alignSelf:'center'
	},
	dialogCancelButton:{
		backgroundColor:'transparent',
		marginTop:20,
		width:'80%',
		alignSelf:'center',
		elevation:0
	},
	textCancelButton:{
		fontSize: 14,
		fontFamily:Theme['dark'].fontBold,
		color:Theme['dark'].highlighted
	},
	rowItem:{
		width:'20%'
	},
	rowLine:{
		alignSelf:'center',
		padding:10,
		marginTop:15,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-end',
		width:'80%',
		borderTopColor:Theme['dark'].primaryText,
		borderTopWidth:1
	},
	optionForm:{
		alignSelf:'center',
		padding:10,
		marginTop:15,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-end',
		width:'100%'
	},
	average:{
		color:Theme['dark'].primaryText,
		fontSize: 14,
		fontFamily:Theme['dark'].fontBold,
	}
}

const mapStateToProps=(state)=>{
	return {
		newOrder:state.newOrder,
		orderBook:state.orderBook,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{getCurrentPrice, placeOrder, getMyOrders, getPosition, placeOrderBulk})(NewOrder);
