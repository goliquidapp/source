import React, {Component} from 'react';
import {ScrollView, Text, View, ActivityIndicator, Dimensions, TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';

import BarList from '../BarList/BarList.component.js';

import Theme from '../../resources/Theme.js';

class Picker extends Component{
	handleSelect=(v)=>{
		const {values}=this.props
		this.props.onValueChange(values[v])
	}
	render(){
		const {values, selectedValue}=this.props
		return (
				<BarList elementSize={20}>
					{
						Object.keys(values).map((v,i)=>{
							return (
								<TouchableOpacity key={i.toString()} onPress={()=>this.handleSelect(v)} style={styles.container}>
									<Text style={values[v]===selectedValue?styles.selected:styles.label}>{v}</Text>
									{(values[v]===selectedValue)&&<View style={styles.dot}></View>}
								</TouchableOpacity>
							)
						})
					}
				</BarList>
			)
	}
}

const styles={
	container:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center'
	},
	label:{
		color: Theme['dark'].secondaryText,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
		fontSize:12
	},
	selected:{
		color: Theme['dark'].primaryText,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
		fontSize:12
	},
	dot:{
		width:4,
		height:4,
		backgroundColor:Theme['dark'].highlighted,
		borderRadius:2
	}
}

export default Picker;