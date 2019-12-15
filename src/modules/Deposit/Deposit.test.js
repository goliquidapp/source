import React from 'react';
import {Clipboard, TouchableOpacity} from 'react-native';
import renderer from 'react-test-renderer';

import {Deposit} from './Deposit.component';

var initialState = {
	loading: false,
	loadingAddress: false,
	address:'address-bitcoin',
	data:[],
	error:null
};

const getDepositAddress = jest.fn().mockResolvedValue();

var props={
	deposit: initialState,
	getDepositAddress
}

describe('Testing Deposit module', () => {
	it('mounts and renders with address', () => {
		const tree = renderer.create(<Deposit {...props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('mounts and renders without address', () => {
		props.deposit.address='';
		const tree = renderer.create(<Deposit {...props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
	it('shows error', () => {
		props.deposit.error={message:'This is an error'};
		const tree = renderer.create(<Deposit {...props}/>).toJSON();
		expect(tree).toMatchSnapshot();
	});
});