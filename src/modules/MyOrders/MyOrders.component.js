import React, {Component} from 'react';
import {View, ScrollView, Text, RefreshControl, TouchableOpacity, Alert, Dimensions} from 'react-native';
import { Icon } from 'react-native-elements';
import {AllHtmlEntities} from 'html-entities';
import Modal from "react-native-modal";

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';
import Colors from '../../resources/Colors.js';

import Expandable from '../../components/Expandable/Expandable.component.js';
import Popup from '../../components/Popup/Popup.component.js';
import Options from '../../components/Options/Options.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import IconButton from '../../components/IconButton/IconButton.component.js';
import Button from '../../components/Button/Button.component.js';

import {getMyOrders,deleteOrder,subscribe} from './MyOrders.actions.js';

import moment from 'moment';
import {filterArray} from '../../helpers/json.js';

const HIGHT=Dimensions.get('window').height;
const DETAILS_PERCENTAGE=0.7;

class MyOrders extends Component{
	constructor(props){
		super(props);
		this.state={showOptions:false,orderIndex:null,showDetails:false,detailsHeight:HIGHT*DETAILS_PERCENTAGE}
		this.moreEqual=new AllHtmlEntities().decode('&#8805');
		this.lessEqual=new AllHtmlEntities().decode('&#8804');
	}
	componentDidMount(){
		
	}
	handleDelete=()=>{
		const {realtimeData}=this.props.myOrders;
		const {filter}=this.props;
		const filteredData=filter?filterArray(realtimeData, filter):realtimeData;

		const {showOptions, orderIndex}=this.state;
		if (filteredData[orderIndex].ordStatus==='Rejected') message="This order is already rejected!\n\nContinue anyway?";
		else message="You're about to delete order"+filteredData[orderIndex].orderID.split('-')[0]+", continue?";
		Alert.alert("My Orders",
					message,
					[
						{
							text:'OK',
                            onPress:()=>{
                                this.setState({showOptions:false,orderIndex:null})
                                this.props.deleteOrder(filteredData[orderIndex])
                            }
						},
						{
							text:'Cancel',
							onPress:()=>{this.setState({showOptions:false,orderIndex:null})}
						}
					])
	}
	showMenu=(index)=>{
		this.setState({showOptions:true,orderIndex:index})
	}
	closeMenu=()=>{
		this.setState({showOptions:false,orderIndex:null})
	}
	showDetails=(index)=>{
		this.setState({showDetails:true,orderIndex:index})
	}
	closeDetails=()=>{
		this.setState({showDetails:false,orderIndex:null, detailsHeight:HIGHT*DETAILS_PERCENTAGE})
	}
	renderMenu=()=>{
		const {showOptions, orderIndex}=this.state;
		const options=[
			{
				title	:'Cancel Order',
				icon  	:{name:'trash',type:'font-awesome'},
				onPress :this.handleDelete
			}
		]
		return (
				<Popup visible={showOptions}
					   onClose={this.closeMenu}>
							<Options options={options}/>
				</Popup>
			)
	}
	renderRow=(item,index)=>{
		const {type}=this.props;
		var background=(index%2===0)?{backgroundColor:Theme['dark'].primary1}:{backgroundColor:Theme['dark'].primary3}
		var row;
		switch (type){
			case 'Active':
				row= (
						<View style={[styles.row,background]}>
							<Text style={styles.symbol}>{item.symbol}</Text>
							<Text style={[styles.normal, styles.mini]}>{item.orderQty||item.leavesQty}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.price)}</Text>
							<Text style={styles.normal}>{item.displayQty||'-'}</Text>
							<Text style={[styles.order[item.side], styles.large]}>{parseFloat((item.orderQty||item.leavesQty)/item.price).toFixed(4)}</Text>
							<Text style={styles.normal}>{item.ordType}</Text>
							<Text style={styles.normal}>{item.ordStatus}</Text>
						</View>
					)
				break;
			case 'Stop':
				row= (
						<View style={[styles.row,background]}>
							<Text style={styles.symbol}>{item.symbol}</Text>
							<Text style={[styles.normal, styles.mini]}>{item.orderQty}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.price)}</Text>
							<Text style={styles.normal}>{(item.ordType.indexOf('Touched')>=0)?((item.side==='Buy')?this.lessEqual:this.moreEqual):((item.side==='Buy')?this.moreEqual:this.lessEqual)}{parseFloat(item.stopPx)}</Text>
							<Text style={styles.normal}>{item.ordType}</Text>
							<Text style={styles.normal}>{item.ordStatus}</Text>
						</View>
					)
				break;
			case 'Filled':
				row= (
						<View style={[styles.row,background]}>
							<Text style={styles.symbol}>{item.symbol}</Text>
							<Text style={[styles.normal, styles.mini]}>{item.orderQty}</Text>
							<Text style={styles.normal}>{parseFloat(item.stopPx)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.price)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{item.symbol==='XBTUSD'?parseFloat(item.orderQty/item.price).toFixed(4):parseFloat(item.orderQty*item.price).toFixed(4)}</Text>
							<Text style={styles.normal}>{item.ordType}</Text>
							<Text style={styles.normal}>{item.orderID.split('-')[0]}</Text>
						</View>
					)
				break;
			case 'Cancel':
				row= (
						<View style={[styles.row,background]}>
							<Text style={styles.symbol}>{item.symbol}</Text>
							<Text style={[styles.normal, styles.mini]}>{item.orderQty}</Text>
							<Text style={styles.normal}>{parseFloat(item.stopPx)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.price)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.orderQty/item.price).toFixed(4)}</Text>
							<Text style={styles.normal}>{item.ordType}</Text>
							<Text style={styles.normal}>{item.orderID.split('-')[0]}</Text>
						</View>
					)
				break;
			case 'All':
				row= (
						<View style={[styles.row,background]}>
							<Text style={styles.symbol}>{item.symbol}</Text>
							<Text style={[styles.normal, styles.mini]}>{item.orderQty}</Text>
							<Text style={styles.normal}>{parseFloat(item.stopPx)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.price)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.orderQty/item.price).toFixed(4)}</Text>
							<Text style={styles.normal}>{item.ordType}</Text>
							<Text style={styles.normal}>{item.orderID.split('-')[0]}</Text>
						</View>
					)
				break;
			default:
				row= (
						<View style={[styles.row,background]}>
							<Text style={styles.symbol}>{item.symbol}</Text>
							<Text style={[styles.normal, styles.mini]}>{item.orderQty}</Text>
							<Text style={styles.normal}>{parseFloat(item.stopPx)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.price)}</Text>
							<Text style={[styles.orderDefault,styles.order[item.side], styles.large]}>{parseFloat(item.orderQty/item.price).toFixed(4)}</Text>
							<Text style={styles.normal}>{item.ordType}</Text>
							<Text style={styles.normal}>{item.orderID.split('-')[0]}</Text>
						</View>
					)
		}
		return <TouchableOpacity key={index.toString()} 
								 onPress={()=>this.showDetails(index)}>{row}</TouchableOpacity>
	}
	renderHeader=()=>{
		const {type}=this.props;
		var background={backgroundColor:Theme['dark'].primary2}
		switch (type){
			case 'Active':
				return (
						<View style={[styles.row,background]} key={'-1'}>
							<Text style={styles.secondary}>{"Symbol"}</Text>
							<Text style={[styles.secondary,styles.mini]}>{"Qty"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Price"}</Text>
							<Text style={styles.secondary}>{"Filled"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Value"}</Text>
							<Text style={styles.secondary}>{"Type"}</Text>
							<Text style={styles.secondary}>{"Status"}</Text>
						</View>
					)
			case 'Stop':
				return (
						<View style={[styles.row,background]} key={'-1'}>
							<Text style={styles.secondary}>{"Symbol"}</Text>
							<Text style={[styles.secondary,styles.mini]}>{"Qty"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Price"}</Text>
							<Text style={styles.secondary}>{"Stop Price"}</Text>
							<Text style={styles.secondary}>{"Type"}</Text>
							<Text style={styles.secondary}>{"Status"}</Text>
						</View>
					)
			case 'Filled':
				return (
						<View style={[styles.row,background]} key={'-1'}>
							<Text style={styles.secondary}>{"Symbol"}</Text>
							<Text style={[styles.secondary,styles.mini]}>{"Qty"}</Text>
							<Text style={styles.secondary}>{"Exec Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Value"}</Text>
							<Text style={styles.secondary}>{"Type"}</Text>
							<Text style={styles.secondary}>{"OrderID"}</Text>
						</View>
					)
			case 'Cancel':
				return (
						<View style={[styles.row,background]} key={'-1'}>
							<Text style={styles.secondary}>{"Symbol"}</Text>
							<Text style={[styles.secondary,styles.mini]}>{"Qty"}</Text>
							<Text style={styles.secondary}>{"Exec Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Value"}</Text>
							<Text style={styles.secondary}>{"Type"}</Text>
							<Text style={styles.secondary}>{"OrderID"}</Text>
						</View>
					)
			case 'All':
				return (
						<View style={[styles.row,background]} key={'-1'}>
							<Text style={styles.secondary}>{"Symbol"}</Text>
							<Text style={[styles.secondary,styles.mini]}>{"Qty"}</Text>
							<Text style={styles.secondary}>{"Exec Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Value"}</Text>
							<Text style={styles.secondary}>{"Type"}</Text>
							<Text style={styles.secondary}>{"OrderID"}</Text>
						</View>
					)
			default:
				return (
						<View style={[styles.row,background]} key={'-1'}>
							<Text style={styles.secondary}>{"Symbol"}</Text>
							<Text style={[styles.secondary,styles.mini]}>{"Qty"}</Text>
							<Text style={styles.secondary}>{"Exec Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Order Price"}</Text>
							<Text style={[styles.secondary, styles.large]}>{"Value"}</Text>
							<Text style={styles.secondary}>{"Type"}</Text>
							<Text style={styles.secondary}>{"OrderID"}</Text>
						</View>
					)
		}
	}
	renderOrders=()=>{
		const {realtimeData}=this.props.myOrders;
		const {filter}=this.props;
		const filteredData=filter?filterArray(realtimeData, filter):realtimeData;
		var rows=[];

		rows.push(this.renderHeader())

		if (filteredData.length===0) return <Text style={styles.empty}>No orders!</Text>

		filteredData.map((item,index)=>{
			var icon=item.ordStatus==='Rejected'?{name:'error',type:'material-icons'}:null
			var cancelStyle=item.ordStatus==='Canceled'?styles.cancelStyle:{}
			var filledStyle=item.ordStatus==='Filled'?styles.filledStyle:{}
			rows.push(this.renderRow(item,index))
		})
		return rows
	}
	renderDetails=()=>{
		const {showDetails, orderIndex, detailsHeight}=this.state;
		const {type}=this.props
		if (orderIndex===null || orderIndex===undefined) return <View></View>

		const {realtimeData}=this.props.myOrders;
		const {filter}=this.props;
		const filteredData=filter?filterArray(realtimeData, filter):realtimeData;

		const body=filteredData[orderIndex]
		return (
				<Modal  isVisible={showDetails}
						backdropColor={Theme['dark'].primaryText}
						backdropOpacity={0.5}
						useNativeDriver
						swipeDirection={'down'}
						onSwipeComplete={this.closeDetails}
						onBackButtonPress={this.closeDetails}
						onBackdropPress={this.closeDetails}
						style={styles.containerDetails}
						onSwipeMove={(value)=>this.setState({detailsHeight:HIGHT*DETAILS_PERCENTAGE*value})}
						onSwipeCancel={()=>this.setState({detailsHeight:HIGHT*DETAILS_PERCENTAGE})}>
					<View style={[styles.details,{height:detailsHeight}]}>
						<ScrollView showsVerticalScrollIndicator={false}>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Order ID
								</Text>
								<Text style={styles.rowBody}>
									{body.orderID}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Side
								</Text>
								<Text style={styles.rowBody}>
									{body.side}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Order Status
								</Text>
								<Text style={styles.rowBody}>
									{body.ordStatus}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Currency
								</Text>
								<Text style={styles.rowBody}>
									{body.currency}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Account
								</Text>
								<Text style={styles.rowBody}>
									{body.account}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Time in force
								</Text>
								<Text style={styles.rowBody}>
									{body.timeInForce}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Notes
								</Text>
								<Text style={styles.rowBody}>
									{body.text||'-'}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Transaction Time
								</Text>
								<Text style={styles.rowBody}>
									{moment(body.transactTime).format('lll')}
								</Text>
							</View>
							<View style={styles.row}>
								<Text style={styles.rowKey}>
									Time
								</Text>
								<Text style={styles.rowBody}>
									{moment(body.timestamp).format('lll')}
								</Text>
							</View>
							{
								(type==='Active' || type==='Stop')&&
								<Button onPress={this.handleDelete} 
										buttonStyle={styles.button} 
										textStyle={styles.textStyle} 
										text={"Cancel Order"}/>
							}
						</ScrollView>
					</View>
				</Modal>
			)
	}
	renderRefreshControl=()=>{
		return <RefreshControl 	refreshing={this.props.myOrders.loading}
								onRefresh={this.props.getMyOrders} />
	}
	renderError=()=>{
        const {error}=this.props.myOrders;
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
		const {loading, data, error, realtimeData}=this.props.myOrders;
		const {containerStyle}=this.props;
		return (
			<ScrollView refreshControl={this.renderRefreshControl()} nestedScrollEnabled={true}>
				<View style={[styles.container,containerStyle]}>
					{this.renderOrders()}
					{this.renderMenu()}
					{this.renderDetails()}
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
	empty:{
		marginTop:'auto',
		marginBottom:'auto',
		paddingVertical:20,
		paddingHorizontal:10,
		color:Theme['dark'].primaryText,
		fontSize:20,
		fontFamily:Theme['dark'].fontNormal
	},
	orders:{
		height:300,
		paddingBottom:50,
		width: "100%"
	},
	order:{
		Buy:{
			color:Theme['dark'].positive,
			fontSize:10,
			width:'12%',
			textAlign:'center',
			fontFamily:Theme['dark'].fontNormal
		},
		Sell:{
			color:Theme['dark'].negative,
			fontSize:10,
			width:'12%',
			textAlign:'center',
			fontFamily:Theme['dark'].fontNormal
		}
	},
	orderDefault:{
		color:Theme['dark'].secondaryText,
		fontSize:10,
		width:'12%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontNormal
	},
	symbol:{
		color:Theme['dark'].highlighted,
		fontSize:10,
		width:'12%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontNormal
	},
	normal:{
		color:Theme['dark'].primaryText,
		fontSize:10,
		width:'12%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontNormal
	},
	secondary:{
		color:Theme['dark'].secondaryText,
		fontSize:10,
		width:'12%',
		textAlign:'center',
		fontFamily:Theme['dark'].fontNormal
	},
	mini:{
		width:'6%'
	},
	large:{
		width:'15%'
	},
	cancelStyle:{
		backgroundColor:Theme['dark'].disabled
	},
	filledStyle:{
		Buy:{
			backgroundColor:Colors['Highland']
		},
		Sell:{
			backgroundColor:Colors['Coral Tree']
		}
	},
	pricesContainer:{
		marginHorizontal:10,
		backgroundColor:Theme['dark'].highlighted,
		paddingHorizontal:10,
		paddingVertical:5,
		borderRadius:5
	},
	row:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		alignSelf:'center',
		paddingVertical:10
	},
	column:{
		flexDirection:'column',
		alignItems:'center',
		justifyContent:'center'
	},
	containerDetails:{
		justifyContent: "flex-end",
		margin:0
	},
	details:{
	    padding: 22,
	    justifyContent: "center",
	    alignItems: "center",
	    borderTopRightRadius: 20,
	    borderTopLeftRadius: 20,
	    borderColor: "rgba(0, 0, 0, 0.1)",
	    paddingTop:30,
	    backgroundColor: Theme['dark'].primary2,
	},
	rowDetails:{
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-around',
		width:'100%',
		alignSelf:'center',
		paddingVertical:5
	},
	rowKey:{
		color:Theme['dark'].primaryText,
		textAlign:'left',
		width:'20%',
		fontSize:12,
		fontFamily:Theme['dark'].fontBold
	},
	rowBody:{
		color:Theme['dark'].primaryText,
		textAlign:'left',
		width:'60%',
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal
	},
	button:{
		width:'40%',
		alignSelf:'center',
		marginTop:40,
		backgroundColor:Theme['dark'].negative
	},
	textStyle:{
		fontSize:12,
		fontFamily:Theme['dark'].fontNormal
	}
}

MyOrders.defaultProps={
	filter: null,
	title:'My Orders'
}

const mapStateToProps=(state)=>{
	return {
		myOrders:state.myOrders
	}
}
export default connect(mapStateToProps,{getMyOrders,deleteOrder,subscribe})(MyOrders);
