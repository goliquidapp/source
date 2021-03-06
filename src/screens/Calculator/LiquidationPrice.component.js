import React, {Component} from 'react';
import {ScrollView, View, ActivityIndicator, Alert, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Switch } from 'react-native-paper';

import Input from '../../components/Input/Input.component.js';

import Theme from '../../resources/Theme.js';

import {liquidation, orderBook} from '../../helpers/finance.js';

class LiquidationPrice extends Component{
	state={quantity:'', entryPrice:'', leverage:'', side:'Buy', buy: true}
	onClose=()=>{
		this.props.navigation.navigate('Home')
	}
	calcLiquidation=()=>{
		const {realtimeData}=this.props.orderBook;
		const {quantity, entryPrice, leverage, side}=this.state;
		const value=quantity/entryPrice;
		const XBT=orderBook(realtimeData).buy.max;
		const liqPrice=((liquidation(entryPrice, value, quantity, leverage, side)).toFixed(2));
		if (!liqPrice || isNaN(liqPrice) || !isFinite(liqPrice)) return 0;
		else return liqPrice;
	}
	sumQuantity=(q1, q2)=>{
		var sum=0;
		if (this.state.side==='Sell'){
			sum= parseInt(q1)-parseInt(q2)
		}else{
			sum= parseInt(q1)+parseInt(q2)
		}
		if (!sum || isNaN(sum) || !isFinite(sum)) return 0;
		else return sum;
	}
	render(){
		const {quantity, entryPrice, leverage, side, buy}=this.state;
		const {loading, realtimeData, error, loadingLeverage}=this.props.position;
		const position=realtimeData[0];
		var openingQty=0;
		if (position){
			if (position.isOpen)
				openingQty=position.openingQty.toFixed(0)||0;
		}
		return (

				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.wrapper}>
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.column}>
							<View style={styles.row}>
								<Input  value={quantity.toString()}
										keyboardType={"number-pad"}
										onChangeText={(value)=>this.setState({quantity:isNaN(parseInt(value))?'':parseInt(value)})}
										placeholder={"Quantity"}
										placeholderTextColor={Theme['dark'].secondaryText}
										textStyle={styles.textStyle}
										containerStyle={styles.textContainer}
										underline={false}/>
								<Input  value={entryPrice.toString()}
										keyboardType={"number-pad"}
										onChangeText={(value)=>this.setState({entryPrice:isNaN(parseInt(value))?'':parseInt(value)})}
										placeholder={"Entry Price"}
										placeholderTextColor={Theme['dark'].secondaryText}
										textStyle={styles.textStyle}
										containerStyle={styles.textContainer}
										underline={false}/>
							</View>
							<View style={styles.row}>
								<Input  value={leverage.toString()}
										keyboardType={"number-pad"}
										onChangeText={(value)=>this.setState({leverage:isNaN(parseInt(value))?'':parseInt(value)})}
										placeholder={"Leverage"}
										placeholderTextColor={Theme['dark'].secondaryText}
										textStyle={styles.textStyle}
										containerStyle={styles.textContainer}
										underline={false}/>
							</View>
							<View style={styles.row}>
								<Text style={styles.sell}>Sell</Text>
								<Switch value={buy}
	                                    onValueChange={()=>this.setState({side:(side==='Sell'?'Buy':'Sell'), buy:!buy})}
	                                    color={Theme['dark'].highlighted}/>
	                            <Text style={styles.buy}>Buy</Text>
							</View>
						</View>
						<View style={[styles.column,styles.table]}>
							<View style={[styles.row,styles.tableRaw]}>
								<Text style={styles.key}>Current Qty</Text>
								<Text style={styles.value}>{openingQty}</Text>
							</View>
							<View style={[styles.row,styles.tableRaw]}>
								<Text style={styles.key}>Resulting Qty</Text>
								<Text style={styles.value}>{this.sumQuantity(openingQty,quantity)}</Text>
							</View>
							<View style={[styles.row,styles.tableRaw]}>
								<Text style={styles.key}>Liquidation Price</Text>
								<Text style={styles.value}>{this.calcLiquidation()}</Text>
							</View>
						</View>
					</View>
				</ScrollView>
				</LinearGradient>
			)
	}
}

const styles={
	wrapper:{
		height:'100%'
	},
	container:{
		flexDirection:'column',
		width:'100%',
		height:'100%',
		alignItems:'center',
		justifyContent:'space-between'
	},
	column:{
		flexDirection:'column',
		alignItems:'center',
		width:'100%',
		alignSelf:'center'
	},
	textContainer:{
		width:'40%'
	},
	textStyle:{
		color: Theme['dark'].highlighted,
		fontSize:20,
		backgroundColor:Theme['dark'].disabled,
		borderRadius:5
	},
	buy:{
		fontSize:20,
		color:Theme['dark'].positive
	},
	sell:{
		fontSize:20,
		color:Theme['dark'].negative
	},
	row:{
		marginVertical:20,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%'
	},
	key:{
		fontWeight:'bold',
		color:Theme['dark'].primaryText,
		fontSize:14,
		width:'50%',
		textAlign:'left'
	},
	value:{
		color:Theme['dark'].primaryText,
		fontSize:14,
		width:'40%',
		textAlign:'right'
	},
	table:{
		width:'90%',
		paddingHorizontal:10
	},
	tableRaw:{
		backgroundColor:Theme['dark'].disabled,
		padding:10,
		paddingHorizontal:20,
		borderRadius:5,
		marginVertical:2
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
		position:state.position,
		orderBook:state.orderBook
	}
}
export default connect(mapStateToProps,null)(LiquidationPrice);
