//This module used the mongoose EMBEDDED DOCUMENTS model relationship 
const mongoose = require('mongoose');
const {genreSchema, genreValidation} = require('./genres-model');


//Schema definition
const movieSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,     //specifies that this property is required, else an error will be thrown
        minlength: 5,
        maxlength: 200,
        lowercase: true,        //converts entered values to lowercase
        trim: true              //removes paddings
    },

    genre: {
        type: genreSchema, 
        required: true     //specifies that this property is required, else an error will be thrown
    },

    numberInStock: { 
        type: Number, 
        required: true,
        min: 0,
        max: 255
    },

    dailyRentalRate: { 
        type: Number,
        required: true,
        min: 0,
        max: 255
    }
});

//Model Definition
const Movie = mongoose.model('Movie', movieSchema);


function movieValidation(userRequest){
    const schema = Joi.object({
        title : Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    });
    return schema.validate({
        title: userRequest.body.title,
        genreId: userRequest.body.genreId,
        numberInStock: userRequest.body.numberInStock,
        dailyRentalRate: userRequest.body.dailyRentalRate
    });
}

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.movieValidation = movieValidation;