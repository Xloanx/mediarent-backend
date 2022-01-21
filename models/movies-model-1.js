//This module used the mongoose REFERENCES model relationship 


const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema, Genre, genreValidation} = require('./genres-model');


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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
        required: true,     //specifies that this property is required, else an error will be thrown
    },

    numberInStock: { 
        type: Number, 
        default: 0
    },

    dailyRentalRate: { 
        type: Number, 
        default: 0
    }
});

//Model Definition
const Movie = mongoose.model('Movie', movieSchema);


function movieValidation(userRequest){
    const schema = Joi.object({
        title : Joi.string().min(3).required(),
        genre: Joi.required()
    });
    return schema.validate({
        title: userRequest.body.title,
        genre: userRequest.body.genre
    });
}

module.exports.movieSchema = movieSchema;
module.exports.Movie = Movie;
module.exports.movieValidation = movieValidation;