import Colors from './Colors.js';
import Material from './Material.js';

export default{
	Transition:800,
	Animation:500,
	dark:{
		primary1: 		'#22222C',
		primary2: 		'#22222C',
		primary3:		'#2F2F39',
		primaryText:	'#FFFFFF',
		highlighted: 	'#5367FF',
		highlightedGrad:['#26B8FF','#8411FF'],
		disabled:		Colors['Mine Shaft'],
		secondaryText:	'#96969C',
		positive:		'#38FFEF',
		warning:		'#FFBB38',
		negative:		'#FF385B',
		border:			Colors['Dove Gray'],
		buy:			'#3A94FF',
		sell:			'#FF1B75',
		buyGrad:		['#3A94FF','#6B3CFF'],
		sellGrad:		['#FF1B75','#ED702D'],
		chart:{
			background: Colors['Blue Charcoal'],
			axisLabel:	Colors['Gray'],
			line:		'#FF9B34',
			tooltip:	'#FF9B34',
			zoom:		Colors['Hit Gray'],
			grid:		Material['blue-grey']['900'],
			zoomMap:	'rgba(0,0,0,0.3)'
		},
		fontNormal:		'SFCompactDisplay-Regular',
		fontBold:		'SFCompactDisplay-Bold'
	}
}