import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import {Balance} from './Balance.component';

const mockRealtTimeData=[
	{
	  "account": 0,
	  "currency": "string",
	  "riskLimit": 0,
	  "prevState": "string",
	  "state": "string",
	  "action": "string",
	  "amount": 0,
	  "pendingCredit": 0,
	  "pendingDebit": 0,
	  "confirmedDebit": 0,
	  "prevRealisedPnl": 0,
	  "prevUnrealisedPnl": 0,
	  "grossComm": 0,
	  "grossOpenCost": 0,
	  "grossOpenPremium": 0,
	  "grossExecCost": 0,
	  "grossMarkValue": 0,
	  "riskValue": 0,
	  "taxableMargin": 0,
	  "initMargin": 0,
	  "maintMargin": 0,
	  "sessionMargin": 0,
	  "targetExcessMargin": 0,
	  "varMargin": 0,
	  "realisedPnl": 0,
	  "unrealisedPnl": 0,
	  "indicativeTax": 0,
	  "unrealisedProfit": 0,
	  "syntheticMargin": 0,
	  "walletBalance": 0,
	  "marginBalance": 0,
	  "marginBalancePcnt": 0,
	  "marginLeverage": 0,
	  "marginUsedPcnt": 0,
	  "excessMargin": 0,
	  "excessMarginPcnt": 0,
	  "availableMargin": 0,
	  "withdrawableMargin": 0,
	  "timestamp": "2019-10-23T07:25:59.701Z",
	  "grossLastValue": 0,
	  "commission": 0
	}
]

var initialState = {
	loading: false,
	data: [],
	realtimeData:mockRealtTimeData,
	error:null
};

const subscribe = jest.fn().mockResolvedValue();
const getMyBalance = jest.fn().mockResolvedValue();

var props={
	balance: initialState,
	subscribe,
	getMyBalance
}

describe('Testing Balance module', () => {
	it('mounts and renders with data', () => {
		const tree = renderer.create(<Balance {...props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('mounts and renders without data', () => {
		props.balance.realtimeData=[];
		const tree = renderer.create(<Balance {...props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('shows error', () => {
		props.balance.error={message:'This is an error'};
		const tree = renderer.create(<Balance {...props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});