import React, {Component} from 'react';
import {ScrollView, View, ActivityIndicator, Alert, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { Switch } from 'react-native-paper';

import Input from '../../components/Input/Input.component.js';

import Theme from '../../resources/Theme.js';

import {ROE, margin, entryValue, exitValue, initialMargin, PNL} from '../../helpers/finance.js';

export default class ProfitLoss extends Component{
    state={quantity:'', entryPrice:'', exitPrice:'', leverage:'', side:'Buy', buy:true}
    onClose=()=>{
        this.props.navigation.navigate('Home')
    }
    calculateMargin=()=>{
        const {quantity, entryPrice, exitPrice, leverage, side}=this.state;
        const marginVal=margin(leverage, quantity, entryPrice, side );
        if (!marginVal || !isFinite(marginVal)) return 0;
        else return marginVal;
    }
    calculateEntryValue=()=>{
        const {quantity, entryPrice, exitPrice, leverage, side}=this.state;
        const initMargin=initialMargin(leverage);
        const entry=entryValue(entryPrice, initMargin, quantity, side);
        if (!entry || !isFinite(entry)) return 0;
        else return entry;
    }
    calculateExitValue=()=>{
        const {quantity, entryPrice, exitPrice, leverage, side}=this.state;
        const initMargin=initialMargin(leverage);
        const exit=exitValue(exitPrice, initMargin, quantity, side);
        if (!exit || !isFinite(exit)) return 0;
        else return exit;
    }
    calculateROE=()=>{
        const {quantity, entryPrice, exitPrice, leverage, side}=this.state;
        const roe= ROE(exitPrice, entryPrice, leverage, side);
        if (!roe) return 0;
        else return roe;
    }
    calculatePNL=()=>{
        const {quantity, entryPrice, exitPrice, leverage, side}=this.state;
        const pnl= PNL(exitPrice, entryPrice, side);
        if (!pnl) return 0;
        else return pnl;
    }
    calculateProfitLoss=()=>{
        const {quantity, entryPrice, exitPrice, leverage, side}=this.state;
        const factor=side==='Buy'?-1:1;
        const value=factor*(this.calculatePNL()/100.0)*(this.calculateEntryValue());
        if (!value || isNaN(value) || !isFinite(value)) return 0;
        else return value;
    }
    render(){
        const {quantity, entryPrice, exitPrice, leverage, side, buy}=this.state;
        const roe=this.calculateROE();
        const marginVal=this.calculateMargin();
        const PNLValue=this.calculatePNL();
        return (
                
                <LinearGradient colors={[Theme['dark'].primary1,  Theme['dark'].primary2, Theme['dark'].primary1]} style={{height:'100%'}}>
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
                <Input  value={exitPrice.toString()}
                keyboardType={"number-pad"}
                onChangeText={(value)=>this.setState({exitPrice:isNaN(parseInt(value))?'':parseInt(value)})}
                placeholder={"Exit Price"}
                placeholderTextColor={Theme['dark'].secondaryText}
                textStyle={styles.textStyle}
                containerStyle={styles.textContainer}
                underline={false}/>
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
                <Text style={styles.key}>Margin</Text>
                <Text style={styles.value}>{(marginVal).toFixed(5)}</Text>
                </View>
                <View style={[styles.row,styles.tableRaw]}>
                <Text style={styles.key}>Entry Value</Text>
                <Text style={styles.value}>{this.calculateEntryValue().toFixed(5)}</Text>
                </View>
                <View style={[styles.row,styles.tableRaw]}>
                <Text style={styles.key}>Exit Value</Text>
                <Text style={styles.value}>{this.calculateExitValue().toFixed(5)}</Text>
                </View>
                <View style={[styles.row,styles.tableRaw]}>
                <Text style={styles.key}>Profit/Loss</Text>
                <Text style={styles.value}>{this.calculateProfitLoss().toFixed(5)}</Text>
                </View>
                <View style={[styles.row,styles.tableRaw]}>
                <Text style={styles.key}>Profit/Loss %</Text>
                <Text style={styles.value}>{PNLValue.toFixed(2)} %</Text>
                </View>
                <View style={[styles.row,styles.tableRaw]}>
                <Text style={styles.key}>ROE %</Text>
                <Text style={styles.value}>{(roe).toFixed(2)} %</Text>
                </View>
                </View>
                </View>
                </ScrollView>
                </LinearGradient>
                
                )
    }
}

const styles={
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
alignSelf:'center',
flex:1
},
textContainer:{
width:'40%',
marginVertical:0
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
