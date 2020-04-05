import React, {Component} from 'react';
import {ScrollView, View, RefreshControl, SafeAreaView, ActivityIndicator, TouchableWithoutFeedback, Platform} from 'react-native';
import { Icon } from 'react-native-elements';
import { ECharts } from "react-native-echarts-wrapper";
import moment from 'moment';
import DatePicker from 'react-native-date-ranges';

import boll from 'bollinger-bands';
import { ma, ema, sma } from 'moving-averages';
import macd from 'macd';
import Ichimoku from 'ichimoku';

import { connect } from 'react-redux';

import Theme from '../../resources/Theme.js';

import {subscribe, getTrades, getPosition} from './Trades.actions.js';
import consts from './Trades.consts.js';

import ErrorPopup from '../../components/ErrorPopup/ErrorPopup.component.js';
import List from '../../components/List/List.component.js';
import IconButton from '../../components/IconButton/IconButton.component.js';
import BarList from '../../components/BarList/BarList.component.js';
import Picker from '../../components/Picker/Picker.component.js';
import Popup from '../../components/Popup/Popup.component.js';

class Trades extends Component{
	constructor(props){
		super(props);
		this.defaultStartDate=moment().subtract(2,'day').format();
		this.defaultEndDate=moment().format();
		this.state={
			startDate: this.defaultStartDate, 
			endDate: this.defaultEndDate, 
			interval: '1h', 
			showBollingerBands:false, 
			selectedIndicators:[consts.MOVING_AVERAGE_CONV_DIVER], 
			showList:false, 
			legend:true,
			zoom:false,
            overlay:true
		}
		this.title='Trading Chart';
		this.format={
			'1h':{time:'lll',unit:'hours'}, 
			'5m':{time:'lll',unit:'minutes'}, 
			'1m':{time:'lll',unit:'minutes'}, 
			'1d':{time:'L',unit:'days'}
		};
		this.option={};
		this.indicators=[
			consts.BOLLINGER_BANDS,
			consts.MOVING_AVERAGES,
			consts.EXPO_MOVING_AVERAGE,
			consts.SMOOTHED_MOVING_AVERAGE,
			consts.MOVING_AVERAGE_CONV_DIVER,
			consts.ICHIMOKU,
			consts.DEATH_GOLDEN
		]
	}
	componentDidMount(){
		setTimeout(()=>{
			const {startDate, endDate, interval}=this.state;
			this.props.getTrades(startDate, endDate, interval);
			this.props.getPosition();
			this.getOptions();
			this.chart.setOption(this.option);
		},800)
	}
	componentDidUpdate(prevProps,prevState){
		if ((this.state.startDate!==prevState.startDate)||(this.state.endDate!==prevState.endDate) || (this.state.interval!==prevState.interval)){
			const {startDate,endDate,interval}=this.state;
			this.props.getTrades(startDate, endDate, interval);
		}
		if (this.props.trades.loading!==prevProps.trades.loading && !this.props.trades.loading){
			this.getOptions();
			this.chart.setOption(this.option);
		}
		if (this.props.trades.data.length>0 && prevProps.trades.data.length===0){
			this.getOptions();
			this.chart.setOption(this.option);
		}
		if (this.props.trades.position.length>0 && prevProps.trades.position.length===0){
			this.getOptions();
			this.getMarkPosition();
			this.chart.setOption(this.option);
		}
	}
	handleIndicatorSelect=(val,select)=>{
		const {selectedIndicators}=this.state;
		if (select){
			this.setState({
				selectedIndicators:[...selectedIndicators, val]
			},()=>{
				switch(val){
					case (consts.DEATH_GOLDEN):
						const endDate=moment().format();
						const startDate=moment(endDate).subtract(2,'years').format();
						const interval='1d';
						this.setState({startDate,endDate,interval});
						break;
					default:
						this.getOptions();
						this.chart.setOption(this.option);
						break;
				}
			})
		}
		else{
			var newSelected=[...selectedIndicators];
			var i=newSelected.indexOf(val);
			newSelected.splice(i,1);
			this.setState({
				selectedIndicators:newSelected
			},()=>{
				this.getOptions();
				this.chart.setOption(this.option);
			})
		}
	}
	getBollingerBands=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
		samples=samples===0?24:samples;

		var close=[];
		data.map((item)=>{
	    	close.push(item['close']);
	    });
	    var {upper, mid, lower}=boll(close);

	    this.option.series.push(
	    		{
					name: 'BB-Upper',
					type: 'line',
					data: upper.slice(Math.max(upper.length - samples, 1)),
					showSymbol:false
				}
	    	)
	    this.option.series.push(
				{
					name: 'BB-Mid',
					type: 'line',
					data: mid.slice(Math.max(mid.length - samples, 1)),
					showSymbol:false
				}
	    	)
	    this.option.series.push(
				{
					name: 'BB-Lower',
					type: 'line',
					data: lower.slice(Math.max(lower.length - samples, 1)),
					showSymbol:false
				}
	    	)

	}
	getMovingAverage=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
		samples=samples===0?24:samples;

		var close=[];
		data.map((item)=>{
	    	close.push(item['close']);
	    });
		var MA=ma(close, 9);

		this.option.series.push(
				{
					name: 'MA',
					type: 'line',
					data: MA.slice(Math.max(MA.length - samples, 1)),
					showSymbol:false
				}
	    	)
	}
	getExpoMovingAverage=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
		samples=samples===0?24:samples;

		var close=[];
		data.map((item)=>{
	    	close.push(item['close']);
	    });
		var EMA=ema(close, 9);

		this.option.series.push(
				{
					name: 'EMA',
					type: 'line',
					data: EMA.slice(Math.max(EMA.length - samples, 1)),
					showSymbol:false
				}
	    	)
	}
	getSmoothedMovingAverage=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
		samples=samples===0?24:samples;

		var close=[];
		data.map((item)=>{
	    	close.push(item['close']);
	    });
		var SMA=sma(close, 7);

		this.option.series.push(
				{
					name: 'SMA',
					type: 'line',
					data: SMA.slice(Math.max(SMA.length - samples, 1)),
					showSymbol:false
				}
	    	)
	}
	getMACD=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
		samples=samples===0?24:samples;

		var close=[];
		data.map((item)=>{
	    	close.push(item['close']);
	    });
		var {MACD, signal, histogram}=macd(close);

		this.option.grid[2].show=true;
		this.option.series.push(
				{
					name: 'MACD',
					type: 'line',
					data: MACD.slice(Math.max(MACD.length - samples, 1)),
					showSymbol:false,
					xAxisIndex:2,
					yAxisIndex:2
				}
	    	)
		this.option.series.push(
				{
					name: 'signal',
					type: 'line',
					data: signal.slice(Math.max(signal.length - samples, 1)),
					showSymbol:false,
					xAxisIndex:2,
					yAxisIndex:2
				}
	    	)
		this.option.series.push(
				{
					name: 'histogram',
					type: 'bar',
					data: histogram.slice(Math.max(histogram.length - samples, 1)),
					showSymbol:false,
					barWidth:2,
					xAxisIndex:2,
					yAxisIndex:2
				}
	    	)
	}
	getIchimoku=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
		samples=samples===0?24:samples;

		var close=[];
		data.map((item)=>{
	    	close.push(item['close']);
	    });
		const ichimoku = new Ichimoku({
		    conversionPeriod : 9,
		    basePeriod       : 26,
		    spanPeriod       : 52,
		    displacement     : 26,
		    values           : []
		})
		var conversionData=[];
		var baseData=[];
		var spanAData=[];
		var spanBData=[];

		for( let candle of data ) {
		    let ichimokuValue = ichimoku.nextValue({
		        high  : candle.high,
		        low   : candle.low,
		        close : candle.close
		    })
		    if (ichimokuValue){
		    	var {conversion, base, spanA, spanB}=ichimokuValue;
			    if (conversion>0) conversionData.push(conversion);
			    if (base>0) baseData.push(base);
			    if (spanA>0) spanAData.push(spanA);
			    if (spanB>0) spanBData.push(spanB);
		    }
		}

		
		this.option.series.push(
				{
					name: 'conversion',
					type: 'line',
					data: conversionData.slice(Math.max(conversionData.length - samples, 1)),
					showSymbol:false
				}
	    	)
		this.option.series.push(
				{
					name: 'base',
					type: 'line',
					data: baseData.slice(Math.max(baseData.length - samples, 1)),
					showSymbol:false
				}
	    	)
		this.option.series.push(
				{
					name: 'spanA',
					type: 'line',
					data: spanAData.slice(Math.max(spanAData.length - samples, 1)),
					showSymbol:false,
				}
	    	)
		this.option.series.push(
				{
					name: 'spanB',
					type: 'line',
					data: spanBData.slice(Math.max(spanBData.length - samples, 1)),
					showSymbol:false,
					barWidth:2
				}
	    	)
	}
	getDeathGoldenCross=()=>{
		const {loading, realtimeData, data, error}=this.props.trades;
		const {startDate, endDate, interval}=this.state;
		
		var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);

		let close=[];
		data.map((item)=>{
			close.push(item['close']);
		})

		const MA200=ma(close, 200);

		this.option.series.push(
				{
					name: '200 MA',
					type: 'line',
					data: MA200.slice(Math.max(MA200.length - samples, 1)),
					showSymbol:false
				}
	    	)
		
		const MA50=ma(close, 50);

		this.option.series.push(
				{
					name: '50 MA',
					type: 'line',
					data: MA50.slice(Math.max(MA50.length - samples, 1)),
					showSymbol:false
				}
	    	)

	}
	getMarkPosition=()=>{
		const {loading, realtimeData, data, error, position}=this.props.trades;
		if (position[0].isOpen){
			this.option.series[0]['markLine']=
				{
					symbol: ['none', 'none'],
					label: {
						show:false
					},
					lineStyle:{
						color:Theme['dark'].chart.line,
						type:'solid',
						width:1
					},
					data: [
						{
	                        name: 'current position',
	                        yAxis: position[0].avgEntryPrice,
	                        valueDim: 'close'
	                    }
	                ]
				}
		}
	}
	getOptions=()=>{
		this.chart.clear();
		const {loading, realtimeData, data, error, position}=this.props.trades;
		const {startDate, endDate, interval, selectedIndicators, legend, zoom}=this.state;

		const dateFormat=this.format[interval].time;

	    var samples=moment(endDate).diff(moment(startDate), this.format[interval].unit);
	    samples=samples===0?24:samples;

	    var dates = [];
		var vals=[];
		var volumes=[];
		data.slice(Math.max(data.length - samples, 1)).map((item,index)=>{
			var x=moment(item['timestamp']).format(dateFormat);
			dates.push(x);
	    	vals.push([+item['open'], +item['close'], +item['low'], +item['high']]);
	    	volumes.push([x,item['volume'],item['open'] > item['close'] ? 1 : -1]);
		})

		this.option = {
			legend:{
				...styles.legend,
				show:legend
			},
			title: {
	          text: 	 this.title,
	          show:		 false,
	          textStyle: styles.title
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					animation: false,
					type:	   'cross',
					lineStyle: styles.tooltip
				},
				textStyle:{
					color: Theme['dark'].chart.primaryText,
					fontSize:10
				}
			},
			axisPointer: {
	            link: {xAxisIndex: 'all'},
	            label: {
	                backgroundColor: 'rgba(10,10,10,0.5)',
	                fontSize:10
	            }
	        },
			animation: true,
			visualMap: {
	            show: false,
	            seriesIndex: 1,
	            dimension: 2,
	            pieces: [{
	                value: 1,
	                color: Theme['dark'].negative
	            }, {
	                value: -1,
	                color: Theme['dark'].positive
	            }]
	        },
			grid: [
	            {
	            	left:20,
	            	right:20,
	                height: '50%',
	                width:'90%',
	            },
	            {
	            	left:20,
	            	right:20,
	                height: '12%',
	                width:'90%',
	                bottom:140,
	            },
	            {
	            	show:false,
	            	left:20,
	            	right:20,
	                height: '12%',
	                width:'90%',
	                bottom:40,
	                borderWidth:0,
	            }
	        ],
			xAxis: [
				{
					data: dates,
					axisLabel: {
						color: Theme['dark'].chart.axisLabel,
						fontSize:8
					},
					splitLine:{
						show: false,
						lineStyle:{
							color:Theme['dark'].chart.grid
						}
					},
					axisLine: {show: false},
				},
				{
					type: 'category',
					data: dates,
					axisLabel: {show: false},
					axisLine: {onZero: false, show: false},
					axisTick: {show: false},
					splitLine: {show: false},
					boundaryGap : false,
					splitNumber: 20,
					scale: true,
					gridIndex: 1
				},
				{
					data: dates,
					axisLabel: {show: false},
					axisLine: {onZero: false, show: false},
					axisTick: {show: false},
					splitLine: {show: false},
					boundaryGap : false,
					splitNumber: 20,
					scale: true,
					gridIndex: 2
				}
			],
			yAxis: [
				{
					scale: true,
					axisLabel: {
						color: Theme['dark'].chart.axisLabel,
						fontSize:8,
						inside:true
					},
					splitLine:{
						show: true,
						lineStyle:{
							color:Theme['dark'].chart.grid
						}
					},
					position:'right',
					axisLine: {show: false},
				},
				{
					scale: true,
					gridIndex: 1,
					splitNumber: 2,
					axisLabel: {show: false},
					axisLine: {show: false},
					axisTick: {show: false},
					splitLine: {show: false}
				},
				{
					scale: true,
					gridIndex: 2,
					splitNumber: 2,
					axisLabel: {show: false},
					axisLine: {show: false},
					axisTick: {show: false},
					splitLine: {show: false}
				}
			],
			textStyle:{
				color: '#fff'
			},
			series: [
				{
					name: 'Trading',
					type: 'candlestick',
					data: vals,
					itemStyle: {
						normal: {
							color: Theme['dark'].positive,
							color0: Theme['dark'].negative,
							borderColor: Theme['dark'].positive,
							borderColor0: Theme['dark'].negative
						}
					}
				},
	            {
	                name: 'Volume',
	                type: 'bar',
	                xAxisIndex: 1,
	                yAxisIndex: 1,
	                data: volumes
	            }
			],
			dataZoom:[
				{
            		id: 'dataZoomX',
            		show:zoom,
		            type: 'slider',
		            xAxisIndex: [0, 1, 2],
		            filterMode: 'filter',
		            textStyle:{
						color: Theme['dark'].chart.zoom
					},
					borderColor:Theme['dark'].disabled,
					fillerColor:Theme['dark'].chart.zoomMap,
					dataBackground:{
						lineStyle:{
							color:Theme['dark'].highlighted
						}
					}
		        },
		        {
		            id: 'dataZoomY',
		            show:zoom,
		            type: 'slider',
		            yAxisIndex: [0, 1, 2],
		            filterMode: 'empty',
		            textStyle:{
						color: Theme['dark'].chart.zoom
					},
					borderColor:Theme['dark'].disabled,
					fillerColor:Theme['dark'].chart.zoomMap,
					dataBackground:{
						lineStyle:{
							color:Theme['dark'].highlighted
						}
					},
					left:0
		        },
		        {
            		id: 'dataZoomInsideX',
		            type: 'inside',
		            xAxisIndex: [0, 1, 2],
		            filterMode: 'filter'
		        }
			]
	    };

	    if (selectedIndicators.indexOf(consts.BOLLINGER_BANDS)>=0) this.getBollingerBands();
	    if (selectedIndicators.indexOf(consts.MOVING_AVERAGES)>=0) this.getMovingAverage();
	    if (selectedIndicators.indexOf(consts.EXPO_MOVING_AVERAGE)>=0) this.getExpoMovingAverage();
	    if (selectedIndicators.indexOf(consts.SMOOTHED_MOVING_AVERAGE)>=0) this.getSmoothedMovingAverage();
	    if (selectedIndicators.indexOf(consts.MOVING_AVERAGE_CONV_DIVER)>=0) this.getMACD();
	    if (selectedIndicators.indexOf(consts.ICHIMOKU)>=0) this.getIchimoku();
	    if (selectedIndicators.indexOf(consts.DEATH_GOLDEN)>=0) this.getDeathGoldenCross();
	    if (position.length>0) this.getMarkPosition();
	}
	renderControl=()=>{
		const {loading}=this.props.trades;
		const {legend, startDate, endDate, interval, selectedIndicators, zoom}=this.state;
		const placeholder=moment(startDate).format('MMM Do YY')+' → '+moment(endDate).format('MMM Do YY')
		return (
			<BarList containerStyle={styles.controlContainer} elementSize={20}>
				<IconButton size={15}
							name={'linechart'} 
							type={'antdesign'}  
							color={selectedIndicators.length?Theme['dark'].highlighted:Theme['dark'].disabled} 
							buttonStyle={styles.controlButton}
							onPress={()=>this.setState({showList:true})}/>
				<IconButton size={15}
							name={'sliders'} 
							type={'feather'}  
							color={zoom?Theme['dark'].highlighted:Theme['dark'].disabled} 
							buttonStyle={styles.controlButton}
							onPress={()=>this.setState({zoom:!zoom},()=>{
								this.getOptions();
								this.chart.setOption(this.option);
							})}/>
				<IconButton size={15}
							name={'map-legend'} 
							type={'material-community'}  
							color={legend?Theme['dark'].highlighted:Theme['dark'].disabled} 
							buttonStyle={styles.controlButton}
							onPress={()=>this.setState({legend:!legend},()=>{
								this.getOptions();
								this.chart.setOption(this.option);
							})}/>
				<IconButton size={15}
							name={'refresh'} 
							type={'material-icons'}  
							color={loading?Theme['dark'].highlighted:Theme['dark'].disabled} 
							buttonStyle={styles.controlButton}
							onPress={()=>this.props.getTrades(startDate, endDate, interval)}/>
				{this.renderDateSelect()}
				<Picker selectedValue={interval}
						 onValueChange={(itemValue)=>this.setState({interval:itemValue})}
						 values={{
						 	'1 Min' : '1m',
						 	'5 Min' : '5m',
						 	'1 Hour': '1h',
						 	'1 Day' : '1d'
						 }}
				/>
			</BarList>
		)
	}
	renderList=()=>{
		const {selectedIndicators, showList}=this.state;
		return(
			<Popup visible={showList} onClose={()=>this.setState({showList:false})}>
				<List 	visible={true} 
				 		onClose={()=>this.setState({showList:false})}
						selected={selectedIndicators} 
						options={this.indicators} 
						onChange={this.handleIndicatorSelect}/>
			</Popup>
		)
	}
	renderChart=()=>{
		const {loading}=this.props.trades;
		return (
				<SafeAreaView style={styles.chart}>
					{loading&&<ActivityIndicator/>}
					<ECharts style={{backgroundColor:Theme['dark'].background}} ref={(ref)=>this.chart=ref}/>
				</SafeAreaView>
			)
	}
	renderDateSelect=()=>{
		const {startDate, endDate, interval}=this.state;
		const placeholder=moment(startDate).format('MMM Do YY')+' → '+moment(endDate).format('MMM Do YY')
		return (
				<View>
					<DatePicker
					    customStyles={{
					    	placeholderText: styles.dateSelect.placeholder,
					    	headerStyle:	 styles.dateSelect.headerStyle,
					    	headerMarkTitle: styles.dateSelect.headerMarkTitle,
					    	contentText: 	 styles.dateSelect.textAfter
					    }}
					    calendarStyle={{
					    	backgroundColor: Theme['dark'].primary1
					    }}
					    containerStyle={{
					    	backgroundColor: Theme['dark'].primary1
					    }}
					    outFormat={('MMM Do YY')}
					    returnFormat={('YYYY-MM-DDThh:mm:ss')}
					    centerAlign
					    allowFontScaling = {true}
					    placeholder={placeholder}
					    mode={'range'}
					    markText={'Select date range'}
					    ButtonText={'Submit'}
					    dateSplitter={' → '}
					    blockAfter={true}
					    onConfirm={({startDate,endDate})=>this.setState({startDate, endDate})}
					    customButton={(onConfirm)=>(
					    	<IconButton size={25}
										name={'done'} 
										type={'material-icons'}  
										color={Theme['dark'].highlighted} 
										onPress={onConfirm}
										reverse={true}
										raised/>
					    )}
					    customCacnelButton={(onConfirm)=>(
					    	<IconButton size={25}
										name={'close'} 
										type={'material-icons'}  
										color={Theme['dark'].negative} 
										onPress={onConfirm}
										reverse={true}
										raised/>
					    )}
					    renderPickButton={()=>(
					    	<Icon   size={15}
									name={'date-range'} 
									type={'material-icons'}  
									color={Theme['dark'].highlighted} 
									containerStyle={styles.controlButton}/>
					    )}
					    selectedBgColor={Theme['dark'].highlighted}
					/>
				</View>
			)
	}
	renderRefreshControl=()=>{
		const {startDate, endDate, interval}=this.state;
		return <RefreshControl 	refreshing={this.props.trades.loading}
								onRefresh={()=>this.props.getTrades(startDate, endDate, interval)} />
	}
	renderError=()=>{
		const {error}=this.props.trades;
		if (error) {
			const message=error.response?error.response.data.error.message:error.message;
			return <ErrorPopup containerStyle={styles.error} message={message}/>
		}
		else{
			return <View></View>
		}
	}
    toggleOverlay=()=>{
        this.setState({overlay:false},()=>{
              setTimeout(()=>this.setState({overlay:true}),500);
        });
        
    }
    renderOverlay=()=>{
        if ((this.state.overlay) && (Platform.OS === 'ios'))
            return (
                <TouchableWithoutFeedback onPressIn={this.toggleOverlay}>
                    <View style={styles.overlay}></View>
                </TouchableWithoutFeedback>
            )
    }
	render(){
		const {loading, realtimeData, data, error}=this.props.trades;
		return (				
			<ScrollView>
				<View style={styles.container}>
					{this.renderControl()}
					{this.renderList()}
					{this.renderChart()}
					{this.renderError()}
                    {this.renderOverlay()}
				</View>
			</ScrollView>
		)
	}
}

const styles={
	container:{
		width:'100%',
		height:'100%',
		flexDirection:'column'
	},
	controlContainer:{
		flexDirection:'row',
		width:'100%',
		paddingVertical:10,
		alignItems:'center',
		justifyContent:'flex-start',
		zIndex:2,
		elevation:1,
		borderBottomColor:Theme['dark'].primary3,
		borderBottomWidth:1
	},
	controlButton:{
		marginHorizontal:10,
		borderWidth:1,
		borderColor: Theme['dark'].disabled,
		padding: 5,
		borderRadius:4
	},
	chart:{
		width:'100%',
		height:650,
		marginHorizontal:0,
		marginVertical:10
	},
	title:{
		fontSize: 15,
		align: 'center',
		lineHeight: 40,
		left: '40%',
		fontFamily:Theme['dark'].fontNormal
	},
	tooltip:{
		color: Theme['dark'].chart.tooltip,
		width: 2,
		opacity: 1,
		fontFamily:Theme['dark'].fontNormal
	},
	dateSelect:{
		container:{
			flexDirection:'row',
			width:'100%',
			alignItems:'center',
			justifyContent:'space-around'
		},
		headerStyle:{
			backgroundColor:Theme['dark'].primary2
		},
		headerMarkTitle:{
			color:Theme['dark'].primaryText,
			fontFamily:Theme['dark'].fontNormal
		},
		textAfter:{
			color:Theme['dark'].primaryText,
			fontFamily:Theme['dark'].fontNormal,
			fontSize: 12
		},
		placeholder:{
			fontSize: 12,
			fontFamily:Theme['dark'].fontNormal
		}
	},
	loading:{
		alignSelf:'center'
	},
	dropdown:{
		width:100,
		color:Theme['dark'].primaryText,
		fontFamily:Theme['dark'].fontNormal
	},
	legend:{
		top:0,
		left:0,
		type:'scroll',
		orient:'horizontal',
		textStyle:{
			color:Theme['dark'].primaryText,
			fontFamily:Theme['dark'].fontNormal,
			fontSize:8
		}
	},
    overlay:{
        position:'absolute',
        top:60,
        left:0,
        backgroundColor:'transparent',
        height:700,
        width:'100%',
        zIndex:100
    },
    error:{
    	bottom:20
    }
}

const mapStateToProps=(state)=>{
	return {
		trades:state.trades
	}
}
export default connect(mapStateToProps,{subscribe, getTrades, getPosition})(Trades);
