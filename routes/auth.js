const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");




//Create User
router.post('/',async (req, res) => {

    const { error } = validate(req.body);

    if (error) {
        const errors = error.details.map((e) => e.message);
        return res.status(400).json(errors);
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json(['Invalid email or password ...']);
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
        return res.status(400).json(['Invalid email or password...']);
    }

    const token = user.generateAuthToken();
    res.send(token);
    
});

//LogOut


function validate(req) {

    const schema = Joi.object({
     
        email: Joi.string().min(10).max(25).required().email(),
        password: Joi.string().min(8).max(255).required().trim()
    });

    return schema.validate(req, { abortEarly: false });
}



module.exports = router;
