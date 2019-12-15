import React, {Component} from 'react';
import { View, ScrollView, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';

import Theme from '../../resources/Theme.js';

class List extends Component{

	render(){
		const {style, visible,onClose, options, selected, onChange}=this.props;
		if (!visible) return <View></View>
		return (
			<View style={[styles.container,style]}>
				<TouchableOpacity style={styles.close} onPress={onClose}>
					<Icon name={'close'} color={Theme['dark'].secondaryText}/>
				</TouchableOpacity>
				<ScrollView nestedScrollEnabled={true}>
					{options.map((option,index)=>{
							if (selected.indexOf(option)>=0){
								return (
										<TouchableOpacity key={index.toString()} style={styles.selectedItem} onPress={()=>onChange(option,false)}>
											<Text style={styles.textItemSelected}>{option}</Text>
										</TouchableOpacity>
									)
							}
							else{
								return (
										<TouchableOpacity key={index.toString()} style={styles.item} onPress={()=>onChange(option,true)}>
											<Text style={styles.textItem}>{option}</Text>
										</TouchableOpacity>
									)
							}
						})}
				</ScrollView>	
			</View>
		)
	}
}

const styles={
	container:{
		justifyContent:'center',
		width:'80%',
		height:400,
		position:'absolute',
		top:'20%',
		left:'10%',
		elevation:5,
		zIndex:11,
		backgroundColor:Theme['dark'].disabled
	},
	item:{
		zIndex:12,
		paddingVertical:5,
		borderBottomColor:Theme['dark'].border,
		borderBottomWidth:1,
		backgroundColor:Theme['dark'].disabled
	},
	selectedItem:{
		zIndex:12,
		paddingVertical:5,
		borderBottomColor:Theme['dark'].border,
		borderBottomWidth:1,
		backgroundColor:Theme['dark'].highlighted
	},
	textItem:{
		fontSize:14,
		padding:20,
		color:Theme['dark'].primaryText
	},
	textItemSelected:{
		fontSize:14,
		padding:20,
		color:Theme['dark'].primaryText
	},
	close:{
		top:5,
		right:5,
		position:'absolute',
		zIndex:13,
		padding:10
	}
}

export default List