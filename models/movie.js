const Joi = require('joi');
const mongoose = require("mongoose");
const { genreSchema } = require('./genre')



//Create the Schema object
const movieSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        minlength: 5,
        max: 25,
        trim: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 250
    },
    dailyRantalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 250
    },
    genre: {
        type: genreSchema,
        required: true,

    }
});


//Create a Model
const Movie = mongoose.model('Movie',movieSchema);

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string().min(5).max(25).required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRantalRate: Joi.number().min(0).required(),
        genreId: Joi.objectId().required()
    });
    return schema.validate(movie, { abortEarly: false });
}


exports.Movie = Movie;
exports.validate = validateMovie;