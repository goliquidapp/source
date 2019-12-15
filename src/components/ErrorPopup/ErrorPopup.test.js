import React from 'react';
import { Text, View} from 'react-native';
import renderer from 'react-test-renderer';

import ErrorPopup from './ErrorPopup.component';

describe("Testing ErrorPopup component",()=>{
	it('renders correctly', () => {
		const wrapper = renderer.create(
    		<ErrorPopup message={"Something wrong!"}/>
    	).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
})