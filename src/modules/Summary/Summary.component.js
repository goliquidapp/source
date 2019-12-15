import React, {Component} from 'react';
import {View, AppState} from 'react-native';
import { Icon } from 'react-native-elements';

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';
import config from '../../config.js';

import {getSummary} from './Summary.actions.js';

import Tag from '../../components/Tag/Tag.component.js';
import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';

import {orderBook} from '../../helpers/finance.js';
import {setLastReading} from '../../helpers/watchdog.js';

class Summary extends Component{
	state={appState: AppState.currentState}
	componentDidMount(){
		AppState.addEventListener('change', this._handleAppStateChange);
	}
	componentWillUnmount(){
		AppState.removeEventListener('change', this._handleAppStateChange);
	}
	_handleAppStateChange = (nextAppState) => {
		if (
			this.state.appState.match(/active/) &&
			(nextAppState === 'inactive' || nextAppState==='background')
		) {
			const {realtimeData}=this.props.orderBook;
			setLastReading({
				buy : orderBook(realtimeData).buy.max,
				sell: orderBook(realtimeData).sell.min
			})
		}
		this.setState({appState: nextAppState});
	}
    renderError=()=>{
        const {error}=this.props.summary;
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
    }
	render(){
		const {value, subtitleBuy2, subtitleSell2, subtitleBuy1, subtitleSell1, disabledButtons} = this.props;
		const {realtimeData, loading}=this.props.orderBook;
		const {currency}=this.props.settings;

		var subtitleBuyValue=subtitleBuy2||(loading?'-':orderBook(realtimeData).sell.min)
		var subtitleSellValue=subtitleSell2||(loading?'-':orderBook(realtimeData).buy.max)

		return (
			<View style={styles.container}>
				<Tag colors={Theme['dark'].buyGrad} 
					 label={'Buy'} 
					 subtitle={subtitleBuy1||'1 at'}
					 subtitle2={`${subtitleBuyValue} ${currency.currencySign}`} 
					 onPress={this.props.onBuy} 
					 line={value?(value>orderBook(realtimeData).sell.min):false}
					 disabled={disabledButtons.buy}/>
				<Tag colors={Theme['dark'].sellGrad} 
					 label={'Sell'} 
					 subtitle={subtitleSell1||'1 at'}
					 subtitle2={`${currency.currencySign} ${subtitleSellValue}`}  
					 onPress={this.props.onSell} 
					 line={value?(value<orderBook(realtimeData).buy.max):false}
					 align={'right'}
					 disabled={disabledButtons.sell}/>
				{this.renderError()}
			</View>
		)
	}
}

Summary.defaultProps={
	disabledButtons:{buy:false, sell:false}
}

const styles={
	container:{
		width:'90%',
		height:100,
		alignSelf:'center',
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'space-between',
		paddingVertical:10,
    	marginTop:10
	},
	separator:{
		width:0,
		height:50,
		borderRadius:15,
		borderStyle:'dashed',
		borderWidth:1,
		borderColor:'white',
		borderRightColor:'transparent',
		borderRadius:1,
		marginHorizontal:20
	},
	empty:{
		position:'absolute'
	}
}

const mapStateToProps=(state)=>{
	return {
		summary:state.summary,
		orderBook:state.orderBook,
		settings:state.settings
	}
}
export default connect(mapStateToProps,{getSummary})(Summary);
