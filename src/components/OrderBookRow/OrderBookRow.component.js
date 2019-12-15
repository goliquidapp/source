import React, {Component} from 'react';
import { View, Text } from 'react-native';
import Colors from '../../resources/Colors.js';
import LinearGradient from 'react-native-linear-gradient';

import {Icon} from 'react-native-elements'

class OrderBookRow extends Component{
	format=(x)=>{
    	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	render(){
		const {containerStyle, priceStyle, sizeStyle, totalStyle, overlayStyle, style, price, side, size, total, symbol, colors, color, reverse }=this.props;
		return (
			<View style={[styles.container,containerStyle]}>
				{
					reverse?
					<View style={styles.totalContainer}>
						<Text style={[styles.total,totalStyle,style]}>{this.format(total)||symbol||"-"}</Text>
					</View>:<View></View>
				}
				<View style={styles.priceSize}>
					<Text style={[styles.price,priceStyle,style,reverse?{textAlign:'right'}:{}]}>{this.format(price)}</Text>
					<Text style={[styles.size,sizeStyle,style,reverse?{textAlign:'right'}:{}]}>{this.format(size)}</Text>
					<View style={[styles.overlay,overlayStyle]}></View>
				</View>
				{
					!reverse?
					<View style={styles.totalContainer}>
						<Text style={[styles.total,totalStyle,style]}>{this.format(total)||symbol||"-"}</Text>
					</View>:<View></View>
				}
			</View>
		)
	}
}

OrderBookRow.defaultProps={
	reverse:false
}

const styles={
	container:{
		flex:1,
		flexDirection:'row',
		alignItems:'flex-start',
		justifyContent:'center',
		alignSelf:'center',
		width:'100%',
		marginVertical:3
	},
	priceSize:{
		flexDirection:'column',
		width:'45%'
	},
	price:{
		width:'100%',
		color:Colors['White']
	},
	size:{
		width:'100%',
		color:Colors['White']

	},
	totalContainer:{
		width:'45%',
		position:'relative'
	},
	total:{
		width:'100%',
		color:Colors['White'],
		textAlign:'center'
	},
	overlay:{
		marginTop:2,
		width:'100%',
		height:2
	}
}

export default OrderBookRow;