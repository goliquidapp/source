import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert} from 'react-native';
import {Icon} from 'react-native-elements';

import { connect } from 'react-redux';

import {clear} from './Notifications.actions.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import * as Animatable from 'react-native-animatable';

class Notifications extends Component{
	state={clearing:false}
	clearNotifications=()=>{
		this.setState({clearing:true},()=>setTimeout(this.props.clear,300))
	}
	renderNotifications=()=>{
		const {clearing}=this.state;
		const {notifications}=this.props.notifications;
		if (notifications.length===0) return <Text style={styles.empty}>No Notifications</Text>
		const cards=[]
		notifications.map((notif, index)=>{
			cards.push(
					<Animatable.View animation={clearing?"slideOutRight":"slideInRight"} useNativeDriver duration={100+(index+1)*10} key={index.toString()} style={styles.card}>
						<Text style={styles.title}>{notif.title}</Text>
						<Text style={styles.body}>{notif.body}</Text>
						<View style={[styles.type, styles.theme[notif.type]]}>
							<Text style={styles.theme[notif.type]}>{notif.time}</Text>
						</View>
					</Animatable.View>
				)
		})
		return cards.reverse()
	}
	renderBar=()=>{
		return(
				<TouchableOpacity style={styles.bar} onPress={this.clearNotifications}>
					<Icon name="clear-all" type="material-icons" color={Theme['dark'].secondaryText} containerStyle={styles.icon}/>
				</TouchableOpacity>
			)
	}
	render(){
		return (
			<ScrollView>
				<View style={styles.container}>
					{this.renderBar()}
					{this.renderNotifications()}
				</View>
			</ScrollView>
		)
	}
}

const styles={
	container:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		height: '100%',
		alignSelf:'center'
	},
	card:{
		width: '90%',
		paddingHorizontal:10,
		paddingVertical:15,
		borderRadius: 8,
		backgroundColor: Theme['dark'].primary3,
		marginVertical:10
	},
	title:{
		fontFamily:Theme['dark'].fontBold,
		fontSize:16,
		fontWeight:'bold',
		color: Theme['dark'].primaryText,
		marginBottom:20,
		width: '70%'
	},
	body:{
		fontFamily:Theme['dark'].fontNormal,
		fontSize:14,
		color: Theme['dark'].primaryText
	},
	type:{
		position:'absolute',
		top:15,
		right:10,
		paddingHorizontal:10,
		paddingVertical: 5,
		borderRadius:8,
		backgroundColor: Theme['dark'].warning
	},
	theme:{
		warning:{
			backgroundColor:Colors['Drover'],
			color:Colors['Pesto'],
			fontFamily:Theme['dark'].fontNormal,
			fontSize: 10
		},
		danger:{
			backgroundColor:Colors['Beauty Bush'],
			color:Colors['Copper Rust'],
			fontFamily:Theme['dark'].fontNormal,
			fontSize: 10
		},
		info:{
			backgroundColor:Colors['Charlotte'],
			color:Colors['Ming'],
			fontFamily:Theme['dark'].fontNormal,
			fontSize: 10
		},
		success:{
			backgroundColor:Colors['Tea Green'],
			color:Colors['Hippie Green'],
			fontFamily:Theme['dark'].fontNormal,
			fontSize: 10
		}
	},
	empty:{
		marginTop:'auto',
		marginBottom:'auto',
		paddingVertical:20,
		paddingHorizontal:10,
		color:Theme['dark'].primaryText,
		fontSize:20,
		fontFamily:Theme['dark'].fontNormal
	},
	bar:{
		paddingVertical:5,
		width: '100%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-end'
	},
	icon:{
		marginHorizontal:20
	}
}

const mapStateToProps=(state)=>{
	return {
		notifications:state.notifications
	}
}
export default connect(mapStateToProps,{clear})(Notifications);