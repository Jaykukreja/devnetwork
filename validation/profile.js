const validator=require('validator');
const isEmpty=require('./is-empty');
module.exports = function validateProfileinput(data){
	let errors ={};

	
	data.handle=!isEmpty(data.handle) ? data.handle : '';
    data.status=!isEmpty(data.status) ? data.status : '';
    data.skills=!isEmpty(data.skills) ? data.skills : '';

	
    if(!validator.isLength(data.handle ,{min:2 ,max:40 })){
        errors.handle=" handle needs to be between 2 and 40 characters"
    }

    if(validator.isEmpty(data.handle)){
        errors.handle=" profile handle is required";
    }

    if(validator.isEmpty(data.status)){
        errors.status="Status field is required";
    }

    if(validator.isEmpty(data.skills)){
        errors.skills="skills field is required";
    }
     if (!isEmpty(data.website)){
         if(!validator.isURL(data.website)){
          errors.website='Not a valid URL'
         }  
    }

    if (!isEmpty(data.youtube)){
        if(!validator.isURL(data.twitter)){
         errors.twitter='Not a valid URL';
        }  
   }

   
   if (!isEmpty(data.facebook)){
    if(!validator.isURL(data.facebook)){
     errors.facebook='Not a valid URL';
    }  
}
   
   if (!isEmpty(data.youtube)){
    if(!validator.isURL(data.youtube)){
     errors.youtubes='Not a valid URL';
    }  

    if (!isEmpty(data.linkedin)){
        if(!validator.isURL(data.linkedin)){
         errors.linkedin='Not a valid URL';
        }  
    }
}
	return {
		errors,
		isValid :isEmpty(errors) 
	}
}