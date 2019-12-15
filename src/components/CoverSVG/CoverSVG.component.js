import React, {Component} from 'react';
import {View} from 'react-native';
import Theme from '../../resources/Theme.js';
import Svg, {Path} from 'react-native-svg';

class CoverSVG extends Component{
	render(){
		return (
			<View style={this.props.style}>
				<Svg height="50%" width="100%">
					
				</Svg>
			</View>
		)
	}
}

const styles={
	button:{
		flexDirection:'row',
		backgroundColor:Theme['dark'].highlighted,
		paddingVertical:10,
		paddingHorizontal:30,
		borderRadius:10,
		elevation:5,
		alignItems:'center',
		justifyContent:'center',
		borderRadius:20
	},
	text:{
		color:Theme['dark'].primaryText,
		fontSize:20
	}
}

export default CoverSVG;
