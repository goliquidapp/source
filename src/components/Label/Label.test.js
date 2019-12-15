import React from 'react';
import { Text, View} from 'react-native';
import renderer from 'react-test-renderer';

import Label from './Label.component';

describe("Testing Label component",()=>{
	it('renders correctly', () => {
		const wrapper = renderer.create(
    		<Label value={""}/>
    	).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
})