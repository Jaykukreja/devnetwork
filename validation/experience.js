const validator=require('validator');
const isEmpty=require('./is-empty');
module.exports = function validateExperienceinput(data){
	let errors ={};
	console.log("data222")
	//console.log(data.name)

	
	data.title=!isEmpty(data.title) ? data.title : '';
    data.company=!isEmpty(data.company) ? data.company : '';
    data.from=!isEmpty(data.from) ? data.from : '';
	
	if(validator.isEmpty(data.title)){
		errors.title =' Job Title is required';
	}

	if(validator.isEmpty(data.company)){
        errors.company ='Company field is required';
	}


    if(validator.isEmpty(data.from)){
		errors.from ='From date field is required';
	}
	return {
		errors,
		isValid :isEmpty(errors) 
	}
}