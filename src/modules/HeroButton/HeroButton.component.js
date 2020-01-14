import React, {Component} from 'react';
import {connect} from 'react-redux';
import Wave from 'react-native-waveview';
import LinearGradient from 'react-native-linear-gradient';
import {Icon} from 'react-native-elements';
import Theme from '../../resources/Theme.js';

import config from '../../config.js';
import navigation from '../../helpers/navigate.js';

import { hook } from 'cavy';

class HeroButton extends Component{
	state={speed:5000};
	componentDidUpdate(prevProps){
		if (prevProps.orderBook.freq!==this.props.orderBook.freq){
			const {freq}=this.props.orderBook;
			const speed=(freq===0)?5000:(config.wavesSpeedParam/freq);
			this.setState({speed});
		}
	}
	renderWave=()=>{
		const {speed}=this.state;
		return (
			<Wave
		        style={styles.logo}
		        H={24}
		        waveParams={[
		            {A: 10, T: 180, fill: Theme['dark'].waves[0]},
		            {A: 15, T: 140, fill: Theme['dark'].waves[1]},
		            {A: 20, T: 100, fill: Theme['dark'].waves[2]},
		        ]}
		        animated={true}
		        speed={speed}
		    />
		)
	}
	render(){
		const {speed}=this.state;

		return (
			<LinearGradient style={styles.buttonContainer} 
							colors={Theme['dark'].highlightedGrad} 
							ref={this.props.generateTestHook('Navigator.HeroButton')} 
							onPress={()=>navigation.navigate('PlaceOrder')}>
				{this.renderWave()}
			    <Icon containerStyle={styles.button} name="plus" color={Theme['dark'].primaryText} type={"font-awesome"} />
			</LinearGradient>
		)
	}
}

const styles={
	logo:{
    	width:56,
    	height:56,
    	aspectRatio: 1,
    	borderRadius: 28,
    	overflow: 'hidden',
    	zIndex:0,
    	borderColor:Theme['dark'].primaryText, borderStyle:'solid', borderWidth:3
    },
    button:{
    	position:'absolute',
    	zIndex:1
    },
    buttonContainer:{
    	borderColor:Theme['dark'].primaryText, 
    	borderStyle:'solid', 
    	borderWidth:3,
    	position:'absolute',
    	top:-28, 
    	elevation:5, 
    	width:56,
    	height:56,
    	borderRadius:28, 
    	alignItems:'center',
    	justifyContent:'center', 
    	backgroundColor:Theme['dark'].skyColor
    }
}

const mapStateToProps=(state)=>{
	return {
		orderBook:state.orderBook
	}
}

export default connect(mapStateToProps, null)(hook(HeroButton));