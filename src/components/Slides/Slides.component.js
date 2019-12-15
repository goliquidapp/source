import React, {Component} from 'react';
import {ScrollView, Text, View, ActivityIndicator, Dimensions} from 'react-native';

import * as Animatable from 'react-native-animatable';

import Card from '../Card/Card.component.js';

import Colors from '../../resources/Colors.js';
import Theme from '../../resources/Theme.js';

const screenWidth = Dimensions.get('window').width

export default class Slides extends Component{
	constructor(props){
		super(props);
		this.state={currentSlide:0,scrolling:false}
		this.scrollValue=0
	}
	componentDidMount(){
		if (this.props.autoplay){
	    	this.interval=setInterval(this.slideShow, 5000);
		}
	}
	componentWillUnmount(){
		if (this.props.autoplay){
	    	clearInterval(this.interval);
		}
	}
	slideShow=()=>{
    	this.scrollValue += screenWidth;
    	if (this.scrollValue > (this.props.children.length-1)*screenWidth) this.scrollValue=0;
    	this.scrollView.scrollTo({x: this.scrollValue, animated: true})
    	
    	const currentSlide=parseInt(this.scrollValue/screenWidth)
    	this.setState({currentSlide,scrolling:false})
	}
	renderDots=()=>{
		if (this.props.dots)
			return (
					<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition} style={styles.dots}>
						{
							this.props.children.map((img,index)=>
								<Animatable.View
									style={[styles.dot,(this.state.currentSlide===index)?styles.selected:{}]}
									key={index.toString()}
									transition="backgroundColor"
									duration={Theme.Animation}
								></Animatable.View>
							)
						}
					</Animatable.View>
				)
	}
	handleScrollEnd=(e)=>{
		var event=e.nativeEvent
		const itemWidth=event.contentSize.width/this.props.children.length
		const currentSlide=parseInt(event.contentOffset.x/itemWidth)
		this.setState({currentSlide,scrolling:false})
	}
	handleScrollBegin=(e)=>{
		this.setState({scrolling:true})
	}
	render(){
		return (
			<Animatable.View animation={"fadeIn"} useNativeDriver duration={Theme.Transition} style={styles.container}>
				<ScrollView ref={(ref)=>this.scrollView=ref}
							onScrollBeginDrag={this.handleScrollBegin} 
							onMomentumScrollEnd={this.handleScrollEnd} 
							showsHorizontalScrollIndicator={false} 
							directionalLockEnabled={true} 
							horizontal={true} 
							pagingEnabled={true} 
							style={{width:'100%',height:'100%'}}
							scrollEnabled>
					{this.props.children}
				</ScrollView>
                {this.renderDots()}
			</Animatable.View>
			)
	}
}

Slides.defaultProps={
	dots:true,
    autoplay:false
}

const styles={
	container:{
		height:'100%',
		position:'relative',
		backgroundColor:'transparent'
	},
	dots:{
		flexDirection:'row',
		position:'absolute',
		bottom:20,
		alignItems:'center',
		justifyContent:'center',
		width:'100%'
	},
	dot:{
		width:6,
		height:6,
		borderRadius:3,
		backgroundColor:'rgba(200,200,200,0.5)',
		margin:2
	},
	selected:{
		backgroundColor:'rgba(255,255,255,1)'
	}
}
