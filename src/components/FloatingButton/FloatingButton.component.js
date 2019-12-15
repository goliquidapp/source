import React, { Component } from 'react';
import { TouchableOpacity, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements';

import Colors from '../../resources/Colors.js';

const height=Dimensions.get('window').height
const width=Dimensions.get('window').width

class FloatingButton extends Component{
	render(){
		return(
				<TouchableOpacity style={[styles.container,this.props.style]} onPress={this.props.onPress}>
					<Icon
						name={this.props.icon}
  						type='font-awesome'
  						size={this.props.size}
  						color={this.props.color}
  						raised
  						reverse
					/>
				</TouchableOpacity>
			)
	}
}

const styles={
	container:{
		flex:1,
		position:'absolute',
		right:10,
		top:0.70*height,
		zIndex:100,
		elevation: 5
	}
}

export default FloatingButton;