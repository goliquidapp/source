import React, {Component} from 'react';
import {View} from 'react-native';
import { connect } from 'react-redux';

import Notification from '../../components/Notification/Notification.component.js';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

class GlobalNotification extends Component{
	render(){
		const {title, body, image, type}=this.props.globalNotification;
		return(
				<Notification title={title} body={body} image={image} type={type}/>
			)
	}
}

const styles={

}

const mapStateToProps=(state)=>{
	return {
		globalNotification:state.globalNotification
	}
}

export default connect(mapStateToProps,{})(GlobalNotification);
