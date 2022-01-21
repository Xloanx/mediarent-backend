const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

//Schema definition
const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,     
        minlength: 5,
        maxlength: 200        
    },

    email: { 
        type: String,
        unique: true, 
        required: true
    },

    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    }

});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({id : this._id}, config.get('token.jwtPrivateKey'));
}

//Model Definition
const User = mongoose.model('User', userSchema);



function userValidation(userRequest){
    const schema = Joi.object({
        name : Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@]{3,30}$')).required()
    });
    return schema.validate({name: userRequest.body.name,
                            email: userRequest.body.email,
                            password: userRequest.body.password
                        });
}


module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.userValidation = userValidation;