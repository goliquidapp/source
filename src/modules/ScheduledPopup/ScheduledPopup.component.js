import React, {Component} from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';

import Popup from '../../components/Popup/Popup.component.js';
import Button from '../../components/Button/Button.component.js';

import Theme from '../../resources/Theme.js'

import moment from 'moment';

class ScheduledPopup extends Component{
	state={visible:false, child:null}
	componentDidMount(){
		if (this.props.scheduledPopup.schedule)
			this.intervalObj=setInterval(this.show,1000*10);
	}
	componentDidUpdate(prevProps){
		if ((this.props.scheduledPopup.schedule!==prevProps.scheduledPopup.schedule) && (this.props.scheduledPopup.schedule)){
			this.intervalObj=setInterval(this.show,1000*10);
		}
	}
	componentWillUnmount(){
		clearInterval(this.intervalObj)
	}
	show=()=>{
		if ((moment().diff(this.props.scheduledPopup.schedule, 'seconds')>0) && !this.state.visible){
			const child=React.cloneElement(this.props.scheduledPopup.children, { onClose: this.hide } );
			this.setState({visible:true, child});
		}
	}
	hide=()=>{
		this.setState({visible:false, child:null},this.props.scheduledPopup.onClose);
	}
	render(){
		return (
			<Popup visible={this.state.visible} onClose={this.hide}>
				{this.state.child}
			</Popup>
		)
	}
}

const mapStateToProps=(state)=>{
	return {
		scheduledPopup:state.scheduledPopup
	}
}

export default connect(mapStateToProps,null)(ScheduledPopup);