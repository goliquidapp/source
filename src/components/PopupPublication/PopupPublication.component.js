import React, {Component} from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import moment from 'moment';
import {Icon} from 'react-native-elements';

import Theme from '../../resources/Theme.js';
import Button from '../Button/Button.component.js';

import {openURL} from '../../helpers/text.js';
import {sleep} from '../../helpers/time.js';

class PopupPublication extends Component{
	state={visible:false}
    handleURL=async ()=>{
        const {title, body ,data}=this.props.content;
        if (Platform.OS==='ios'){
            this.props.onClose();
            await sleep(500)
        }
        openURL(data.link||`https://twitter.com/${data.authorUsername}`)
    }
	render(){
		const {title, body ,data}=this.props.content;
		const impactStyle=[
			styles.impact, 
			{
				color:	data.impact===0?Theme['dark'].primaryText:
						data.impact>0?Theme['dark'].positive:Theme['dark'].negative
			}
		]
		const sentiment=data.impact===0?'sentiment-neutral':
						data.impact>0?'sentiment-satisfied':'sentiment-dissatisfied'
		return(
			<View style={styles.dialog}>
				<View style={styles.dialogContent}>
					<View style={styles.section}>
						<View style={styles.row}>
							{
								data.subjects.map((subject, index)=>
									<Text style={styles.tags} key={index.toString()}>{`${subject.code.toUpperCase()} `}</Text>
								)
							}
						</View>
					</View>
					<View style={styles.section}>
						<Text style={styles.dialogTitle}>{title}</Text>
						<Text style={styles.dialogText}>{body}</Text>
					</View>
						<View style={styles.section}>
							<View style={styles.row}>
								<Icon name={sentiment} type={'material-icons'} color={impactStyle[1].color} size={18}/>
								<Text style={impactStyle}>{data.impact.toFixed(2)}/10.0</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.author}>{data.authorUsername?`@${data.authorUsername}`:''}</Text>
								<Text style={styles.date}>{moment(data.timestamp).fromNow()}</Text>
							</View>
						</View>
				</View>
				<Button text={`Open Link`} 
						onPress={this.handleURL}
						buttonStyle={styles.dialogButton} textStyle={styles.dialogText}/>
				<Button text={'Close'} onPress={this.props.onClose} buttonStyle={[styles.dialogButton, styles.cancelButton]} textStyle={styles.dialogText}/>
			</View>
		)
	}
}


const styles={
	dialog:{
		width:'100%',
		backgroundColor:Theme['dark'].primary3,
		alignSelf:'center',
		padding:20,
		borderRadius:20
	},
	dialogContent:{
		width:'100%',
		alignSelf:'center',
		alignItems:'center',
		paddingTop:10,
		marginBottom:20
	},
	dialogButton:{
		marginTop:20,
		width:'60%',
		alignSelf:'center',
		backgroundColor:Theme['dark'].highlighted,
		color: Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontNormal,
	},
	cancelButton:{
		backgroundColor:'transparent',
		color:Theme['dark'].negative,
		elevation:0,
		fontFamily:Theme['dark'].fontNormal
	},
	dialogText:{
		color: Theme['dark'].primaryText,
		fontSize:16,
		fontFamily:Theme['dark'].fontNormal,
		alignSelf:'flex-start',
		textAlign:'left'
	},
	dialogTitle:{
		marginBottom: 20,
		color: Theme['dark'].primaryText,
		fontSize:20,
		fontWeight:'bold',
		alignSelf:'center',
		fontFamily:Theme['dark'].fontBold
	},
	section:{
		width:'100%',
		flexDirection:'column',
		justifyContent:'center',
		alignItems:'center',
		marginTop:10
	},
	row:{
		width:'100%',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'flex-start',
		marginVertical:5
	},
	impact:{
		marginLeft:5,
		fontSize:12,
		fontFamily:Theme['dark'].fontBold
	},
	tags:{
		marginLeft:5,
		fontSize:12,
		fontFamily:Theme['dark'].fontBold,
		color:Theme['dark'].highlighted
	},
	date:{
		marginLeft:'auto',
		marginRight:5,
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal,
		color:Theme['dark'].secondaryText
	},
	author:{
		marginRight:'auto',
		marginLeft:5,
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal,
		color:Theme['dark'].secondaryText
	}
}


export default PopupPublication;
