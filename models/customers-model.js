const mongoose = require('mongoose');
const Joi = require('joi');

//Schema definition
const customerSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,     
        minlength: 5,
        maxlength: 200,
        lowercase: true,        
        trim: true              
    },

    isGold: { 
        type: Boolean, 
        required: true
    },

    phone: {
        type: String, 
        required: true,     
        minlength: 5
    }

});

//Model Definition
const Customer = mongoose.model('Customer', customerSchema);



function customerValidation(userRequest){
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        isGold: Joi.boolean().required(),
        phone: Joi.string().min(14).required()
    });
    return schema.validate({name: userRequest.body.name, 
                            isGold: userRequest.body.isGold, 
                            phone: userRequest.body.phone
                        });
}


module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.customerValidatation = customerValidation;