/**
	round to the nearest 0.5
*/
export const average=(x,y)=>{
	if (x && y){
		var avg=(x+y)/2;
		return (Math.round(avg*2))/2;
	}else{
		return 0
	}
};

export const round=(x)=>{
	if (x){
		return (Math.round(x*2))/2;
	}else{
		return 0
	}
};

export const orderBook=(realtimeData)=>{
	if ( realtimeData.length===0 ) return {sell:{min:0,max:0},buy:{min:0,max:0}};

	var buy=realtimeData.filter((item)=>item.side==='Buy');
	var sell=realtimeData.filter((item)=>item.side==='Sell');

	return ({
			sell:{
					min:sell[sell.length-1]?sell[sell.length-1].price:0,
					max:sell[0]?sell[0].price:0
				},
			buy:{
					min:buy[buy.length-1]?buy[buy.length-1].price:0,
					max:buy[0]?buy[0].price:0
				}
		})
}

export const lastTrade=(realtimeData)=>{
	const empty={
		homeNotional:0,
		tickDirection:'MinusTick',
		price:0,
		size:0
	}
	if ( realtimeData.length===0 ) return {sell:empty,buy:empty};

	var buy=realtimeData.filter((item)=>item.side==='Buy');
	var sell=realtimeData.filter((item)=>item.side==='Sell');

	var buyOrdered=buy.sort((a,b)=>b.timestamp-a.timestamp)
	var sellOrdered=sell.sort((a,b)=>b.timestamp-a.timestamp)
	
	return ({
			sell:sellOrdered[0]?sellOrdered[0]:empty,
			buy:buyOrdered[0]?buyOrdered[0]:empty
		})
}

export const satoshiToBitcoin=(sat)=>{
	(sat*10e-9).toFixed(4);
	var xbt=(sat*10e-9);
	return (xbt.toFixed(4));
}


// from https://www.bitmex.com/app/fees
const takerFee=0.075/100;

const makerFee=-0.025/100;

// from https://www.bitmex.com/app/perpetualContractsGuide#Final-Funding-Rate-Calculation
const FUNDING_RATE=0.00375;

// from https://www.bitmex.com/app/riskLimitsExamples
export const maintenanceMargin=(positionValueXBT)=>{
	var percentage=0.5/100.0;
	if (positionValueXBT<200) percentage=0.5/100.0;
	else if (positionValueXBT<300) percentage=1.0/100.0;
	else if (positionValueXBT<400) percentage=1.5/100.0;
	else if (positionValueXBT<500) percentage=2.0/100.0;
	return percentage-takerFee;
}

export const initialMargin=(leverage)=>{
	return ((1/leverage)-(2*takerFee))
}

// from https://medium.com/@BambouClub/the-bitmex-calculator-d40969eac0c8
export const margin=(leverage, quantity, entryPrice,side)=>{
	const fee=side==='Buy'?takerFee:makerFee;
	return ((((1/leverage)*quantity)+fee)/entryPrice)
}

export const bankrupt=(entryPrice, leverage, side)=>{
	const initMargin=initialMargin(leverage);
	if (side==='Buy') return entryPrice/(1+initMargin)
	else return entryPrice/(1-initMargin);
}


export const liquidation=(entryPrice, positionValueXBT, quantity, leverage, side)=>{
	const bankruptValue=bankrupt(entryPrice, leverage, side);
	const maintMargin=maintenanceMargin(positionValueXBT);
	if (side==='Buy') return bankruptValue+(quantity*(maintMargin+FUNDING_RATE))
	else return bankruptValue-(quantity*(maintMargin-FUNDING_RATE))
}

export const ROE=(exitPrice, entryPrice, leverage, side)=>{
	if (side==='Buy'){
		return (((exitPrice-entryPrice)/entryPrice)*100.0)*leverage
	}else{
		return (((entryPrice-exitPrice)/entryPrice)*100.0)*leverage
	}
}

export const PNL=(exitPrice, entryPrice, side)=>{
	if (side==='Buy'){
		return (((exitPrice-entryPrice)/entryPrice)*100.0)
	}else{
		return (((entryPrice-exitPrice)/entryPrice)*100.0)
	}
}

export const entryValue=(entryPrice, margin, quantity, side)=>{
	if (side==='Buy')
		return -1*(quantity-margin)/entryPrice;
	else
		return (quantity-margin)/entryPrice;
}

export const exitValue=(exitPrice, margin, quantity, side)=>{
	if (side==='Buy')
		return -1*(quantity-margin)/exitPrice;
	else
		return (quantity-margin)/exitPrice;
}

export const exitPrice=(entryPrice, roe, leverage, side)=>{
	if (side==='Buy'){
		return (((roe/(leverage*100.0))*entryPrice)+entryPrice)
	}else{
		return -1*(((roe/(leverage*100.0))*entryPrice)-entryPrice)
	}
}