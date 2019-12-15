import React, {Component} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import Colors from '../../resources/Colors.js';
import Theme from '../../resources/Theme.js'

import * as Animatable from 'react-native-animatable';

class SearchBar extends Component{
	constructor(props){
		super(props)
		this.state={editMode:false}
	}
	handleChangeText=(value)=>{
		if (value.length>0){
			this.setState({editMode:true})
		}else{
			this.setState({editMode:false})
		}
		if (this.props.onChangeText)
			this.props.onChangeText(value)
	}
	render(){
		return (
			<Animatable.View style={[styles.container,this.props.containerStyle]} animation={"fadeInDown"} useNativeDriver duration={Theme.Transition}>
				<View>
					<TextInput
						keyboardType={this.props.keyboardType} 
						style={[styles.input,this.props.textStyle,this.state.editMode?{backgroundColor:Colors['White']}:{}]} 
						placeholder={this.props.placeholder} 
						value={this.props.value}
						onChangeText={this.handleChangeText}/>
				</View>
				<TouchableOpacity style={styles.search}>
					<Icon name="search" size={30}/>
				</TouchableOpacity>
			</Animatable.View>
		)
	}
}

const styles={
	container:{
		position:'relative'
	},
	input:{
		backgroundColor:'rgba(255,255,255,0.8)',
		paddingVertical:10,
		paddingHorizontal:60,
		fontSize:20,
		borderRadius:40,
		elevation:5,
		width:'100%'
	},
	search:{
		position:'absolute',
		elevation:5,
		top:10,
		left:15
	}
}

export default SearchBar;