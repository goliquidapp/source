import React, {Component} from 'react';
import {ScrollView, View, Text, RefreshControl, AppState} from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import Colors from '../../resources/Colors.js';
import Theme from '../../resources/Theme.js';

import {subscribe, getOrderBook, unsubscribe, flush} from './OrderBook.actions.js';

import OrderBookRow from '../../components/OrderBookRow/OrderBookRow.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

class OrderBook extends Component{
	constructor(props){
		super(props);
		this.maxTotal;
		this.state={appState: AppState.currentState}
	}
	componentDidMount(){
		this.props.subscribe();
		this.props.getOrderBook();
		AppState.addEventListener('change', this._handleAppStateChange);
	}
	componentDidUpdate(prevProps){
		if (prevProps.settings.currency.symbolFull!==this.props.settings.currency.symbolFull){
			this.props.unsubscribe(prevProps.settings.currency);
			this.props.getOrderBook();
			this.props.subscribe();
		}
	}
	componentWillUnmount() {
		AppState.removeEventListener('change', this._handleAppStateChange);
	}
	_handleAppStateChange = (nextAppState) => {
		if (nextAppState.match(/inactive|background/)){
			this.props.flush();
		}
		if (!nextAppState.match(/inactive|background/)){
			this.props.subscribe();
			this.props.getOrderBook();
		}
	}
	calcTotal=(side,id)=>{
		const {realtimeData}=this.props.orderBook;
		
		var data=[...realtimeData];
		if (side==='Buy') data.reverse();

		var rows=data.filter((item)=>item.side===side)
		var total=0;
		for (var i=rows.length-1; i>=0;i--){
			total+=rows[i].size;
			if (rows[i].id===id) return total;
		}
		return total
	}
	renderOrderBook=(side)=>{
		const {loading, realtimeData, error}=this.props.orderBook;

		var filteredData=realtimeData.filter((item)=>item.side===side);
		var rows=[];

		this.maxTotal=this.calcTotal(side);
		var depth=Math.min(filteredData.length,20);
		var start, end;

		if (side==='Buy'){
			start=0;
			end=depth;
		}else{
			start=filteredData.length-depth;
			end=filteredData.length;
		}
		for (let i=start; i<end; i++){
			var total=this.calcTotal(side,filteredData[i].id);
			var width=(((total/this.maxTotal)*100)).toString()+'0%';

			rows.push(<OrderBookRow {...filteredData[i]}
								 key={i.toString()}
								 total={total}
								 sizeStyle={styles.size[side]}
								 overlayStyle={[styles.overlay[side],{width}]}
								 totalStyle={styles.total[side]}
								 priceStyle={styles.row[side]}
								 reverse={side==='Sell'}/>)
		}
		return rows;
	}
	renderRefreshControl=()=>{
		return <RefreshControl  refreshing={this.props.orderBook.loading}
								onRefresh={this.props.subscribe} />
	}
    renderError=()=>{
        const {error}=this.props.orderBook;
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
		const {loading, realtimeData, error}=this.props.orderBook
		return (
				<ScrollView nestedScrollEnabled={true}>
					<View style={styles.rowContainer}>
						<View style={styles.container}>
							<View style={styles.header}>
								<Text style={styles.headerCell['buy']}>Price</Text>
								<Text style={styles.headerCell['total']}>Total</Text>
							</View>
							<View style={styles.tabsContainer}>
								<View style={styles.table}>
									{this.renderOrderBook('Buy')}
								</View>
							</View>
							{this.renderError()}
						</View>
						<View style={styles.container}>
							<View style={styles.header}>
								<Text style={styles.headerCell['total']}>Total</Text>
								<Text style={styles.headerCell['sell']}>Price</Text>
							</View>
							<View style={styles.tabsContainer}>
								<View style={styles.table}>
									{this.renderOrderBook('Sell')}
								</View>
							</View>
							{this.renderError()}
						</View>
					</View>
				</ScrollView>
		)
	}
}

const styles={
	rowContainer:{
		width:'90%',
		alignSelf: 'center',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between'
	},
	container:{
		height:'100%',
		width:'48%',
		alignSelf:'center',
		borderRadius:8,
		paddingVertical:10,
		backgroundColor:Theme['dark'].primary3
	},
	size:{
		Sell:{
			color:Theme['dark'].primaryText,
			fontSize: 12,
			fontFamily:Theme['dark'].fontNormal
		},
		Buy:{
			color:Theme['dark'].primaryText,
			fontSize: 12,
			fontFamily:Theme['dark'].fontNormal
		}
	},
	total:{
		Sell:{
			color:Theme['dark'].warning,
			fontFamily:Theme['dark'].fontNormal
		},
		Buy:{
			color:Theme['dark'].warning,
			fontFamily:Theme['dark'].fontNormal
		}
	},
	overlay:{
		Sell:{
			backgroundColor:Theme['dark'].negative,
			marginLeft:'auto'
		},
		Buy:{
			backgroundColor:Theme['dark'].positive
		}
	},
	row:{
		Sell:{
			color:Theme['dark'].negative,
			fontFamily:Theme['dark'].fontNormal
		},
		Buy:{
			color:Theme['dark'].positive,
			fontFamily:Theme['dark'].fontNormal
		}
	},
	tabsContainer:{
		width:'100%',
		alignSelf:'center',
		flexDirection:'row',
		justifyContent:'space-between'
	},
	table:{
		width:'100%',
		alignSelf:'center',
		paddingTop:10,
		marginBottom:20,
		elevation:5
	},
	headerCell:{
		buy:{
			color:Theme['dark'].primaryText,
			fontSize:12,
			paddingVertical:5,
			paddingHorizontal:20,
			borderRadius:8,
			fontWeight:'bold',
			backgroundColor:Theme['dark'].buy,
			fontFamily:Theme['dark'].fontNormal
		},
		sell:{
			color:Theme['dark'].primaryText,
			fontSize:12,
			paddingVertical:5,
			paddingHorizontal:20,
			borderRadius:8,
			fontWeight:'bold',
			backgroundColor:Theme['dark'].sell,
			fontFamily:Theme['dark'].fontNormal
		},
		total:{
			color:Theme['dark'].primaryText,
			fontSize:12,
			paddingVertical:5,
			paddingHorizontal:20,
			borderRadius:8,
			fontWeight:'bold',
			backgroundColor:Theme['dark'].warning,
			fontFamily:Theme['dark'].fontNormal
		}
	},
	header:{
		width:'100%',
		alignSelf:'center',
		flexDirection:'row',
		alignItems:'center',
		fontWeight:'bold',
		paddingVertical:0,
		justifyContent:'space-around'
	}
}

const mapStateToProps=(state)=>{
	return {
		orderBook:state.orderBook,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{subscribe, getOrderBook, unsubscribe, flush})(OrderBook);
