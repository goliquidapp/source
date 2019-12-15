import {notify} from '../../helpers/notifications.js';
import {update} from '../../helpers/json.js';

export const updateOrders=(source,updates)=>{
	updates.map((item,index)=>{
		var data=source.find((oldItem)=>(oldItem.orderID===item.orderID));
		if (data) {
			data=update(data,item)
		}
	})
}

export const deleteOrders=(source,updates)=>{
	updates.map((item,index)=>{
		for (var i=0;i<source.length;i++){
			var currentItem=source[i]
			if (oldItem.orderID===item.orderID){
				source.splice(i,1);
				break;
			}
		}
	})
}

export const insertOrders=(source,updates)=>{
	updates.map((item,index)=>{
		source.push(item)
	})
}

export const notifyUpdate=(data)=>{
	data.map((order)=>{
		const {orderID, ordStatus, text}=order;
		if (orderID&&ordStatus){
			notify({
				title:`Order ${orderID.split('-')[0]} ${ordStatus}`,
				body:text||'',
				type:(ordStatus==='Filled'?'success':'info')
			})
		}
	})
}

export const notifyInsert=(data)=>{
	data.map((order)=>{
		const {orderID, ordStatus, side, ordType, price, orderQty, clOrdID}=order;
		if (orderID&&ordStatus&&side&&orderQty){
			notify({
				title:`${ordStatus} ${ordType} order ${clOrdID||orderID.split('-')[0]}`,
				body:`${side} ${orderQty} contracts at ${price||'-'}`,
				type:'info'
			})
		}
	})
}