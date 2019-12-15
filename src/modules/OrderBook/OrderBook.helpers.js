export const updateOrderBook=(source,updates)=>{
	updates.map((item,index)=>{
		var data=source.find((oldItem)=>(oldItem.id===item.id && oldItem.side===item.side));
		if (data) {
			if (item.size) data.size=item.size
			if (item.price) data.price=item.price
		}
	})
}

export const deleteOrderBook=(source,updates)=>{
	updates.map((item,index)=>{
		for (var i=0;i<source.length;i++){
			var currentItem=source[i]
			if (currentItem.id===item.id && currentItem.side===item.side){
				source.splice(i,1);
				break;
			}
		}
	})
}

export const insertOrderBook=(source,updates)=>{
	updates.map((item,index)=>{
		source.push(item)
	})
}