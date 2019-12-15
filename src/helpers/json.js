export const update=(source,updates)=>{
	Object.keys(updates).map((k,i)=>{
		source[k]=updates[k]
	})
	return source
}

export const filterArray=(arr,filters)=>{
	var filtered=[];
	filters.map((filter)=>{
		arr.map((item)=>{
			var valid=true;
			Object.keys(filter).map((key)=>{
				valid=valid&&(item[key]===filter[key])
			})
			if (valid) filtered.push(item)
		});
	})
	
	return filtered;
}
