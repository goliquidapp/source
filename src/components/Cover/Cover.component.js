import React, {Component} from 'react';
import {View,Dimensions,Image} from 'react-native';

const screenWidth = Dimensions.get('window').width

class Cover extends Component{
	constructor(props){
		super(props)
		this.state={width:'100%',height:'100%'}
	}
	componentDidMount(){
		if (this.props.cover){
			Image.getSize(this.props.cover, (width, height) => {
	            const scaleFactor = width / screenWidth
	            const imageHeight = height / scaleFactor
	            this.setState({width:screenWidth,height:imageHeight})
	        });
		}
	}
	render(){
		const {cover} = this.props
		const {width, height}=this.state
		return (
				<View style={styles.container}>
					<Image style={{width,height}} source={{uri:cover}}/>
				</View>
			)
	}
}

const styles={
	container:{
		backgroundColor:'rgba(0,0,0,0.9)',
		width:'100%',
		top:-50
	}
}

export default Cover