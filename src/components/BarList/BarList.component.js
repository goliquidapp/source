import React, {Component} from 'react';
import {ScrollView, Text, View, ActivityIndicator, Dimensions} from 'react-native';
import * as Animatable from 'react-native-animatable';

class BarList extends Component{
	render(){
		return (
				<Animatable.View animation={"fadeIn"} useNativeDriver duration={800} style={[styles.container,this.props.containerStyle]}>
					<ScrollView ref={(ref)=>this.scrollView=ref}
								onScrollBeginDrag={this.handleScrollBegin} 
								onMomentumScrollEnd={this.handleScrollEnd} 
								showsHorizontalScrollIndicator={false} 
								directionalLockEnabled={true} 
								horizontal={true} 
								pagingEnabled={true}
								snapToInterval={this.props.elementSize} 
								scrollEnabled
								contentContainerStyle={styles.scrollContainer}>
						{this.props.children}
					</ScrollView>
				</Animatable.View>
			)
	}
}

const styles={
	container:{
		position:'relative'
	},
	scrollContainer:{
		flexDirection:'row', 
		alignItems:'center'
	}
}


export default BarList