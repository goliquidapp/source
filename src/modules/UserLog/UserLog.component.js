import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert} from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';

import Expandable from '../../components/Expandable/Expandable.component.js';
import Popup from '../../components/Popup/Popup.component.js';
import Options from '../../components/Options/Options.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import IconButton from '../../components/IconButton/IconButton.component.js';

import {getUserLog} from './UserLog.actions.js';

class UserLog extends Component{
	state={showOptions:false,logIndex:null}
	componentDidMount(){
		this.props.getUserLog();
	}
	renderLogs=()=>{
		const {data}=this.props.userLog;
		if (data.length===0) return <Text style={styles.empty}>No logs!</Text>
		var rows=[]
		rows=data.map((item,index)=>{
			var icon=item.ordStatus==='Rejected'?{name:'error',type:'material-icons'}:null
			return <Expandable  key={index.toString()}
								title={item.ip}
								body={item}
								headerStyle={styles.log}
								icon={icon}/>
		})
		return (rows);
	}
	renderRefreshControl=()=>{
		return <RefreshControl 	refreshing={this.props.userLog.loading}
								onRefresh={this.props.getUserLog} />
	}
	renderHead=()=>{
		if (this.props.head)
			return (
					<TouchableOpacity style={styles.head} onPress={this.props.onPress}>
						<Text style={styles.title}>User Logs</Text>
						<IconButton name={"window-maximize"}
									type={"font-awesome"}
									color={Colors['White']}
									size={20}
									onPress={this.props.onPress}/>
					</TouchableOpacity>
				)
		else return <View></View>
	}
    renderError=()=>{
        const {error}=this.props.userLog;
        if (error) {
            var message='';
            if (error.response){
                if (error.response.data.error)
                    message=error.response.data.error.message
                else
                    message=error.message
            }else {
                message=error.message;
            }
            return <ErrorPopup message={message}/>
        }
        else{
            return <View></View>
        }
    }
	render(){
		const {loading, data, error}=this.props.userLog
		const {containerStyle}=this.props
		return (
			<ScrollView refreshControl={this.renderRefreshControl()} nestedScrollEnabled={true}>
				<View style={[styles.container,containerStyle]}>
					{this.renderHead()}
					{this.renderLogs()}
					{this.renderError()}
				</View>
			</ScrollView>
		)
	}
}

const styles={
	container:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'space-around',
		width:'90%',
		alignSelf:'center',
		borderTopLeftRadius:10,
		borderTopRightRadius:10,
		flex:1
	},
	head:{
		marginBottom:'auto',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		color:Theme['dark'].primaryText,
		backgroundColor:Theme['dark'].primary1,
		paddingVertical:10,
		paddingHorizontal:10,
		borderTopLeftRadius:10,
		borderTopRightRadius:10,
		elevation:5,
		fontSize:20,
		width:'100%'
	},
	title:{
		color:Theme['dark'].primaryText,
		fontSize:20,
		fontFamily:Theme['dark'].fontNormal
	},
	empty:{
		marginTop:'auto',
		marginBottom:'auto',
		paddingVertical:20,
		paddingHorizontal:10,
		color:Theme['dark'].primaryText,
		fontSize:20,
		fontFamily:Theme['dark'].fontNormal
	},
	logs:{
		height:300,
		paddingBottom:50
	},
	log:{
		backgroundColor:Theme['dark'].disabled
	}
}

const mapStateToProps=(state)=>{
	return {
		userLog:state.userLog
	}
}
export default connect(mapStateToProps,{getUserLog})(UserLog);
