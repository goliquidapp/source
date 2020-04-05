import React, {Component} from 'react';
import {View, ScrollView, Text, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as Animatable from 'react-native-animatable';

import Theme from '../../resources/Theme.js';

import currencies from '../Settings/Settings.consts.js';

import {updateSettings} from '../Settings/Settings.actions.js';

const SCREEN_WIDTH=Dimensions.get('window').width;

class CurrencySelect extends Component{
	changeCurrency=(currency)=>{
		this.props.updateSettings({currency})
	}
	renderCurrencies=()=>{
		const {currency} = this.props.settings;
		const items=[];
		Object.keys(currencies).map((item, index)=>{
			const selected=(currency.symbolFull===currencies[item].symbolFull);
			items.push(
				<TouchableOpacity key={index.toString()} style={[styles.column, selected?styles.selected:{}]} onPress={()=>this.changeCurrency(currencies[item])}>
					<Text style={[styles.title, selected?styles.selectedText:{}]}>{`${item}`}</Text>
					<Text style={[styles.subTitle, selected?styles.selectedSubText:{}]}>{`${currencies[item].name}`}</Text>
				</TouchableOpacity>
			)
		})
		return items;
	}
	render(){
		return (
			<Animatable.View style={[styles.container, styles.row]} animation={"slideInDown"} useNativeDriver duration={Theme.Transition}>
					{this.renderCurrencies()}
			</Animatable.View>
		)
	}
}

const styles={
	container:{
		width:'100%',
		height:80,
		paddingVertical:20
	},
	title:{
		color:Theme['dark'].primaryText,
		fontSize:14,
		fontFamily:Theme['dark'].fontNormal,
		textAlign:'center'
	},
	subTitle:{
		color:Theme['dark'].secondaryText,
		fontSize:10,
		fontFamily:Theme['dark'].fontNormal,
		textAlign:'center'
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
		justifyContent:'center',
		height:'100%'
	},
	selectedText:{
		fontFamily:Theme['dark'].fontBold
	},
	selectedSubText:{
		color:Theme['dark'].primaryText
	},
	selected:{
		fontFamily:Theme['dark'].fontBold,
		backgroundColor:Theme['dark'].highlighted,
		padding:10,
		shadowColor: Theme['dark'].highlighted,
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.37,
		shadowRadius: 7.49,

		elevation: 12,

		borderRadius:8
	}
}

const mapStateToProps=(state)=>{
	return {
		settings:state.settings
	}
}

export default connect(mapStateToProps,{updateSettings})(CurrencySelect);
