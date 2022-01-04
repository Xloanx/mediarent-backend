const Joi = require('joi');
const mongoose = require('mongoose');


//Schema definition
const genreSchema = new mongoose.Schema({
    genreName: {
        type: String, 
        required: true,     //specifies that this property is required, else an error will be thrown
        minlength: 5,
        maxlength: 200,
        lowercase: true,        //converts entered values to lowercase
        trim: true              //removes paddings
    },

    date: { 
        type: Date, 
        default: Date.now 
    },

});

//Model Definition
const Genre = mongoose.model('Genre', genreSchema);


function genreValidation(userRequest){
    const schema = Joi.object({
        genreName : Joi.string().min(3).required()
    });
    return schema.validate({genreName: userRequest.body.genreName});
}

module.exports.Genre = Genre;
module.exports.genreValidation = genreValidation;