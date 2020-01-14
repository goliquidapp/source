import { fromLeft, zoomIn, zoomOut } from 'react-navigation-transitions'


const handleCustomTransition = ({ scenes }) => {
	const prevScene = scenes[scenes.length - 2];
	const nextScene = scenes[scenes.length - 1];

	if (nextScene.route.routeName === 'NewOrder') {
		return zoomIn();
	} else if (prevScene
		&& prevScene.route.routeName === 'NewOrder') {
		return zoomOut();
	}
	return fromLeft();
}


export default {
	normal:{
		transitionConfig: ()=>fromLeft()
	}
}