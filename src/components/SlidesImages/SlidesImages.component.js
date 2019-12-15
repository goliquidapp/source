import React, {Component} from 'react';
import {View} from 'react-native';

import Slides from '../Slides/Slides.component.js'
import Card from '../Card/Card.component.js'

export default class SlidesImages extends Component{
	render(){
		const {autoplay,images,onPress,dots}=this.props
		return (
				<Slides autoplay={autoplay} dots={dots}>
					{
						images.map((image,index)=>
							<Card key={index.toString()} image={image} onPress={onPress?(()=>onPress(index)):undefined} overlay={false}/>
						)
					}
				</Slides>
			)
	}
}

SlidesImages.defaultProps={
	dots:true
}