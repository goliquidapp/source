import {update} from '../../helpers/json.js';

export const updateBalance=(source,updates)=>{
	updates.map((item,index)=>{
		var data=source.find((oldItem)=>(oldItem.account===item.account && oldItem.currency===item.currency));
		if (data) {
			data=update(data,item)
		}
	})
}

export const deleteBalance=(source,updates)=>{
	updates.map((item,index)=>{
		for (var i=0;i<source.length;i++){
			var currentItem=source[i]
			if (oldItem.account===item.account && oldItem.currency===item.currency){
				source.splice(i,1);
				break;
			}
		}
	})
}

export const insertBalance=(source,updates)=>{
	updates.map((item,index)=>{
		source.push(item)
	})
}