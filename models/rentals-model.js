const Joi = require('joi');
const mongoose = require('mongoose');
const {customerSchema} = require('./customers-model');
const {movieSchema} = require('./movies-model');


//Schema definition
const rentalSchema = new mongoose.Schema({
    customer: {
        type: customerSchema, 
        required: true     //specifies that this property is required, else an error will be thrown
    },

    movie: {
        type: movieSchema, 
        required: true     //specifies that this property is required, else an error will be thrown
    },

    dateOut: { 
        type: Date,
        required: true,
        default: Date.now 
    },

    dateReturned: { 
        type: Date
    },

    rentalFee:{
        type: Number,
        required: true
    }
});

//Model Definition
const Rental = mongoose.model('Rental', rentalSchema);


function rentalValidation(userRequest){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
        rentalFee: Joi.number().required()
    });
    return schema.validate({
        customerId: userRequest.body.customerId,
        movieId: userRequest.body.movieId,
        rentalFee: userRequest.body.rentalFee
    });
}

module.exports.rentalSchema = rentalSchema;
module.exports.Rental = Rental;
module.exports.rentalValidation = rentalValidation;