const Joi = require('joi');
const mongoose = require("mongoose");


const genreSchema = new  mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      max: 25,
      trim: true
    },
  });
  
const Genre =  mongoose.model("Genre", genreSchema);



function validateGenres(genre) {
    let schema = Joi.object({
      name: Joi.string().min(5).required(),
    });
    return schema.validate(genre, { abortEarly: false });
  }
 
exports.Genre = Genre;
exports.validate = validateGenres;