import {update} from '../../helpers/json.js';
import {notify} from '../../helpers/notifications.js';

export const updatePosition=(source,updates)=>{
	updates.map((item,index)=>{
		var data=source.find((oldItem)=>(oldItem.account===item.account && oldItem.symbol===item.symbol));
		if (data) {
			data=update(data,item)
		}
	})
}

export const deletePosition=(source,updates)=>{
	updates.map((item,index)=>{
		for (var i=0;i<source.length;i++){
			var currentItem=source[i]
			if (oldItem.account===item.account && oldItem.symbol===item.symbol){
				source.splice(i,1);
				break;
			}
		}
	})
}

export const insertPosition=(source,updates)=>{
	updates.map((item,index)=>{
		source.push(item)
	})
}

export const notifyUpdate=(data)=>{
	data.map((order)=>{
		const {posState, symbol, currentQty, markPrice, liquidationPrice}=order;
		if ((posState==='Liquidated')&&symbol&&currentQty&&markPrice&&liquidationPrice){
			notify({
				title:`Liquidation Notice`,
				body:`Your ${symbol} position of ${currentQty} contracts has been liquidated at market price ${markPrice}\nYour position has liquidation price of ${liquidationPrice}`,
				type:'danger'
			})
		}
	})
}
