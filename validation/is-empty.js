const isEmpty = value => {
		value === undefined ||
		value === null 

		// //checking whether object is empty or not using object.keys
		// (typeof value === 'object' && object.keys(value).length === 0) || 
		// (typeof value ==='string' && value.trim().length === 0);
		}
module.exports= isEmpty;