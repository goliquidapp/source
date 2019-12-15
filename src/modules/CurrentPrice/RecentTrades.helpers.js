export const updateRecentTrades=(source,updates)=>{
	updates.map((item,index)=>{
		var data=source.find((oldItem)=>(oldItem.trdMatchID===item.trdMatchID && oldItem.side===item.side));
		if (data) {
			if (item.size) data.size=item.size
			if (item.price) data.price=item.price
		}
	})
}

export const deleteRecentTrades=(source,updates)=>{
	updates.map((item,index)=>{
		for (var i=0;i<source.length;i++){
			var currentItem=source[i]
			if (currentItem.trdMatchID===item.trdMatchID && currentItem.side===item.side){
				source.splice(i,1);
				break;
			}
		}
	})
}

export const insertRecentTrades=(source,updates)=>{
	updates.map((item,index)=>{
		source.push(item)
	})
}