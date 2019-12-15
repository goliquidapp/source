import React, {Component} from 'react';
import {ScrollView, Text, View, ActivityIndicator, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';

import Theme from '../../resources/Theme.js';

class Steps extends Component{
	renderLine=()=>{
		return (
				<View style={styles.line}></View>
			)
	}
	renderSteps=()=>{
		const {steps}=this.props;

		var nodes=steps.map((step, index)=>{
			return (
					<View key={index.toString()} style={styles.step}>
						<Text style={styles.text[step.state]}>{step.title}</Text>
						<View style={styles.outerCircle[step.state]}>
							<View style={styles.innerCircle[step.state]}></View>
						</View>
					</View>
				)
		})
		return nodes
	}
	render(){
		return (
				<Animatable.View animation={"fadeIn"} useNativeDriver duration={800} style={[styles.container,this.props.containerStyle]}>
					<View style={[styles.steps, this.props.stepsContainer]}>
						{this.renderLine()}
						{this.renderSteps()}
					</View>
				</Animatable.View>
			)
	}
}

const styles={
	container:{
		position:'relative',
		width:'100%'
	},
	steps:{
		flexDirection:'row', 
		alignItems:'center',
		justifyContent:'space-around',
		alignSelf:'center',
		width:'90%'
	},
	step:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center',
		width:'20%'
	},
	text:{
		current:{
			fontSize:12,
			color:Theme['dark'].primaryText,
			marginBottom:10
		},
		next:{
			fontSize:12,
			color:Theme['dark'].disabled,
			marginBottom:10
		}
	},
	innerCircle:{
		current:{
			width:4,
			height:4,
			borderRadius:2,
			backgroundColor:Theme['dark'].highlighted
		},
		next:{
			width:4,
			height:4,
			borderRadius:2,
			backgroundColor:Theme['dark'].disabled
		}
		
	},
	outerCircle:{
		current:{
			flexDirection:'row',
			alignItems:'center',
			justifyContent:'center',
			width:20,
			height:20,
			backgroundColor:'transparent',
			borderWidth:1,
			borderColor:Theme['dark'].highlighted,
			borderRadius:10
		},
		next:{
			flexDirection:'row',
			alignItems:'center',
			justifyContent:'center',
			width:20,
			height:20,
			backgroundColor:'transparent',
			borderWidth:1,
			borderColor:'transparent',
			borderRadius:10
		}
	},
	line:{
		position:"absolute",
		top:'76%',
		left:'25%',
		height:1,
		backgroundColor:Theme['dark'].disabled,
		width:'50%'
	}
}


export default Steps