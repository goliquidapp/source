import React from 'react';
import { Text, View, TouchableOpacity, ScrollView} from 'react-native';
import renderer from 'react-test-renderer';

import { shallow } from 'enzyme';

import List from './List.component';

describe("Testing List component",()=>{
	it('renders correctly', () => {
		const options=[
			'option1',
			'option2',
			'option3'
		]
		const wrapper = renderer.create(
    		<List visible={true} options={options} selected={'option2'}/>
    	).toJSON();

		expect(wrapper).toMatchSnapshot();
	});

	it('opens when changing visible prop', () => {
		const options=[
			'option1',
			'option2',
			'option3'
		]
		const wrapper = shallow(
    		<List visible={false} options={options} selected={'option2'}/>
    	);

		expect(wrapper.find(ScrollView).length).toEqual(0);

		wrapper.setProps({ visible: true });

		expect(wrapper.find(ScrollView).length).toEqual(1);
	});
})