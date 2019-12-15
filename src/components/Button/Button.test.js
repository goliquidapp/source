import React from 'react';
import { Text, View, TouchableOpacity} from 'react-native';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme'

import Button from './Button.component';

describe("Testing Button component",()=>{
	it('renders correctly', () => {
		const wrapper = renderer.create(
    		<Button text={"Click me!"}>
                <View>
                    <Text>I am a child</Text>
                </View>
            </Button>
    	).toJSON();
		expect(wrapper).toMatchSnapshot();
	});

    it('call function when clicked',()=>{
        const onPressEvent = jest.fn();
        onPressEvent.mockReturnValue('Link on press invoked');

        const wrapper = shallow(
            <Button text={"Click me!"} onPress={onPressEvent}>
                <View>
                    <Text>I am a child</Text>
                </View>
            </Button>
        )

        wrapper.find(TouchableOpacity).first().props().onPress();
        expect(onPressEvent.mock.calls.length).toBe(1);
    })
})