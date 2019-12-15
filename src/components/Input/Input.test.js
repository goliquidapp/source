import React from 'react';
import { Text, View} from 'react-native';
import renderer from 'react-test-renderer';

import Input from './Input.component';

describe("Testing Input component",()=>{
	it('renders correctly', () => {
		const wrapper = renderer.create(
    		<Input value={""}/>
    	).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
})