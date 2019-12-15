import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements'

import Colors from '../../resources/Colors.js';
import TextTicker from 'react-native-text-ticker'

class ErrorPopup extends Component{
	constructor(props){
		super(props);
		this.state={visible:true}
		this.timeout=100;
		this.timeoutObj=null;
	}
	componentDidMount(){
		this.toggle()
	}
	componentDidUpdate(prevProps){
		if (prevProps.message!==this.props.message){
			this.setState({visible:true},this.toggle)
		}
	}
	componentWillUnmount(){
		clearTimeout(this.timeoutObj)
	}
	toggle=()=>{
		this.timeoutObj=setTimeout(()=>this.setState({visible:false}),this.timeout*this.props.message.length)
	}
	render(){
		const {containerStyle,messageStyle,message,visible}=this.props
		if (this.state.visible){
			return (
				<View style={[styles.container,containerStyle]}>
					<Icon name="error" type='material-icons' size={20} color={Colors['White']}/>
					<TextTicker
                        repeatSpacer={50}
                        marqueeDelay={this.timeout*4}
                        duration={this.timeout*this.props.message.length}
                        style={[styles.message,messageStyle]}>

                        {message}

                    </TextTicker>
				</View>
			)
		}else{
			return <View></View>
		}
	}
}

const styles={
	container:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center',
		width:'100%',
		height:50,
		position:'absolute',
		backgroundColor:'rgba(255,0,0,0.8)',
		bottom:0,
		left:0,
		zIndex:100,
		elevation:8,
		paddingHorizontal:10
	},
	message:{
		color:Colors['White'],
		textAlign:'center',
		paddingHorizontal:10
	}
}

export default ErrorPopup