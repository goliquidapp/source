import React, {Component} from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import {Icon} from 'react-native-elements';

import Colors from '../../resources/Colors.js';
import Themes from '../../resources/Theme.js';

export default class Expandable extends Component{
	state={open:false}
	renderHead=()=>{
		const {containerStyle, bodyStyle, headerStyle, titleStyle, title, icon, rightComponent}=this.props;
		const {open}=this.state;
		return (
				<TouchableOpacity style={[styles.header,headerStyle]} onPress={this.toggle} onLongPress={this.props.onLongPress}>
					<Text style={[styles.title,titleStyle]}>{title}</Text>
					<View style={styles.headerRight}>
							{icon&&<Icon name={icon.name} type={icon.type} color={Colors['White']} size={20}/>}
							{rightComponent}
							{
								open?
								<Icon name="chevron-up" type="entypo" color={Colors['White']} size={20}/>:
								<Icon name="chevron-down" type="entypo" color={Colors['White']} size={20}/>
							}
					</View>
				</TouchableOpacity>
			)
	}
	renderBody=()=>{
		const {containerStyle,bodyStyle, body}=this.props;
		const {open}=this.state;
		const keys=Object.keys(body)
		if (open)
			return(
					<View style={[styles.body,bodyStyle]}>
						<ScrollView>
							{keys.map((key,index)=>{
								if (typeof(body[key])==='object'){
									return (<Text key={index.toString()} style={styles.row}><Text style={styles.rowKey}>{key}</Text>: {JSON.stringify(body[key])}</Text>)
								}
								else return (<Text key={index.toString()} style={styles.row}><Text style={styles.rowKey}>{key}</Text>: {body[key]}</Text>)
							})}
						</ScrollView>
					</View>
				)
		else 
			return <View></View>
	}
	toggle=()=>{
		this.setState({open:!this.state.open})
	}
	render(){
		const {containerStyle, bodyStyle, headerStyle, titleStyle, title, icon}=this.props;
		const {open}=this.state;
		return (
				<View style={[styles.container,containerStyle]}>
					{this.renderHead()}
					{this.renderBody()}
				</View>
			)
	}
}

const styles={
	container:{
		width:'100%',
		alignSelf:'center',
		paddingHorizontal:10,
		marginVertical:5
	},
	body:{
		elevation:1,
		padding:10,
		backgroundColor:Colors['Desert Storm']
	},
	header:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		elevation:2,
		fontSize:12,
		width:'100%',
		padding:20,
		alignSelf:'center',
		backgroundColor:Themes['dark'].primary1
	},
	headerRight:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-end',
		width:'40%'
	},
	row:{
		width:'100%',
		fontSize:14,
		paddingVertical:3,
		borderBottomWidth:1,
		borderBottomColor:Colors['Mercury']
	},
	rowKey:{
		fontWeight:'bold'
	},
	title:{
		color:Colors['White'],
		fontSize:16,
		width:'60%'
	}
}