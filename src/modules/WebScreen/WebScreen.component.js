import React, {Component} from 'react';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import {Icon} from 'react-native-elements';

import { WebView } from 'react-native-webview';
import {close, loaded} from './WebScreen.actions.js';

import Popup from '../../components/Popup/Popup.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

class WebScreen extends Component{
	renderError=()=>{
        const {error}=this.props.webScreen;
        if (error) {
            return <ErrorPopup message={error}/>
        }
        else{
            return <View></View>
        }
    }
	render(){
		const {loading, opened, url}=this.props.webScreen;
		return(
				<Popup style={styles.container} visible={opened} onClose={this.props.close}>
					<TouchableOpacity style={styles.close} onPress={this.props.close}>
                        <Icon name="close" color={Colors['White']} reverse raised color={Theme['dark'].primary3} size={14}/>
                    </TouchableOpacity>
					<WebView onLoadEnd={this.props.loaded} 
							 containerStyle={styles.content} 
							 style={styles.webpage} 
							 source={{uri:url}}
							 useWebKit={true}/>
					{loading&&<ActivityIndicator style={styles.spinner} color={Theme['dark'].highlighted} size={'large'}/>}
					{this.renderError()}
				</Popup>
			)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%'
	},
	content:{
		width:'100%',
		height:'100%',
		backgroundColor:Theme['dark'].primary3,
		alignSelf:'center',
		padding:10,
		borderRadius:10
	},
	webpage:{
		backgroundColor: Theme['dark'].primary3,
        borderRadius:10
	},
	spinner:{
		position:'absolute',
		top:0, right:0, left:0, bottom:0
	},
	close:{
        position:'absolute',
        top:15,
        left:15,
        zIndex:10
    },
}

const mapStateToProps=(state)=>{
	return {
		webScreen:state.webScreen
	}
}

export default connect(mapStateToProps,{close, loaded})(WebScreen);
