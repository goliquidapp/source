import React from 'react';
import { Text, View} from 'react-native';
import renderer from 'react-test-renderer';

import BarList from './BarList.component';

describe("Testing BarList component",()=>{
	it('renders correctly', () => {
		const wrapper = renderer.create(
    		<BarList>
    			<Text>Text 1</Text>
    			<View>
    				<Text>View 1</Text>
    			</View>
    			<View>
    				<Text>View 2</Text>
    			</View>
    			<View>
    				<Text>View 3</Text>
    			</View>
    			<Text>Text 2</Text>
    		</BarList>
    	).toJSON();
		expect(wrapper).toMatchSnapshot();
	});
})