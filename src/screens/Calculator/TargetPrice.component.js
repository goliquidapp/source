import React, {Component} from 'react';
import {ScrollView, View, ActivityIndicator, Alert, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Switch } from 'react-native-paper';

import Input from '../../components/Input/Input.component.js';

import Theme from '../../resources/Theme.js';

import {exitPrice} from '../../helpers/finance.js';

export default class TargetPrice extends Component{
	state={entryPrice:'', leverage:'', roe:'', side:'Buy', buy:true}
	onClose=()=>{
		this.props.navigation.navigate('Home')
	}
	calculateExitPrice=()=>{
		const { entryPrice, leverage, side, roe}=this.state;
		const value=exitPrice(entryPrice, roe, leverage, side);
		if (!value || isNaN(value) || !isFinite(value)) return 0;
		else return value;
	}
	render(){
		const {entryPrice, roe, leverage, side, buy}=this.state;
		return (
				<LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={styles.wrapper}>
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.column}>
							<View style={styles.row}>
								<Input  value={leverage.toString()}
										keyboardType={"number-pad"}
										onChangeText={(value)=>this.setState({leverage:isNaN(parseInt(value))?'':parseInt(value)})}
										placeholder={"Leverage"}
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
								<Input  value={roe.toString()}
										keyboardType={"number-pad"}
										onChangeText={(value)=>this.setState({roe:isNaN(parseInt(value))?'':parseInt(value)})}
										placeholder={"ROE %"}
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
								<Text style={styles.key}>Target Price</Text>
								<Text style={styles.value}>{this.calculateExitPrice()}</Text>
							</View>
							<View style={[styles.row,styles.tableRaw]}>
								<Text style={styles.key}>Profit/Loss %</Text>
								<Text style={styles.value}>{isNaN(roe/leverage)?0:(roe/leverage)} %</Text>
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
	}
}

