const Joi = require('joi');
const mongoose = require("mongoose");
const config = require('config');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        minlength: 5,
        max: 25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        max: 25,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        max: 1024,
        trim: true
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
   
});


userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id , name:this.name,isAdmin:this.isAdmin}, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User',userSchema);


function validateUser(user) {

    const schema = Joi.object({
        name: Joi.string().min(5).max(25).required(),
        email: Joi.string().min(10).max(25).required().email(),
        password: Joi.string().min(8).max(255).required().trim()
    });

    return schema.validate(user, { abortEarly: false });
}


exports.User = User;
exports.validate = validateUser;