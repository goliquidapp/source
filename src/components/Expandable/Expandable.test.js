import React from 'react';
import { Text, View, TouchableOpacity, ScrollView} from 'react-native';
import renderer from 'react-test-renderer';

import { shallow } from 'enzyme';

import Expandable from './Expandable.component';

describe("Testing Expandable component",()=>{
	it('renders correctly', () => {
		const dummyData={
			key1:'value1',
			key2:'value2'
		}

		const wrapper = renderer.create(
    		<Expandable title={"Click me to see details"} body={dummyData}/>
    	).toJSON();

		expect(wrapper).toMatchSnapshot();
	});

	it('extends after click', () => {
		const onPressEvent = jest.fn();
        onPressEvent.mockReturnValue('Body is shown');

		const dummyData={
			key1:'value1',
			key2:'value2'
		}

		const wrapper = shallow(
    		<Expandable title={"Click me to see details"} body={dummyData}/>
    	);

    	expect(wrapper.find(ScrollView).length).toEqual(0);

    	wrapper.find(TouchableOpacity).first().props().onPress();
    	
		expect(wrapper.find(ScrollView).length).toEqual(1);
	});

	it('calls on long press', () => {
		const onPressEvent = jest.fn();
        onPressEvent.mockReturnValue('Long pressed, showing menu');

		const dummyData={
			key1:'value1',
			key2:'value2'
		}

		const wrapper = shallow(
    		<Expandable title={"Click me to see details"} body={dummyData} onLongPress={onPressEvent}/>
    	);

    	wrapper.find(TouchableOpacity).first().props().onLongPress();
    	
		expect(onPressEvent.mock.calls.length).toBe(1);
	});
})