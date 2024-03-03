const _ = require('lodash');
const bcrypt = require('bcryptjs');
const auth = require('../middlewares/auth');
const { User, validate } = require('../models/user');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


//Get User
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id)
                           .select('-password');
    res.send(user);
});

//Create User
router.post('/', async (req, res) => {

    const { error } = validate(req.body);

    if (error) {
        const errors = error.details.map((e) => e.message);
        return res.status(400).json(errors);
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json(['User  already registered...']);
    }
     user = new User(_.pick(req.body,['name', 'email','password']));

     const salt = await bcrypt.genSalt(10);
     user.password = await bcrypt.hash(user.password, salt);
     

     await user.save();

    const token = user.generateAuthToken();


    res.header('x-auth-token', token).send(_.pick(user,['_id','name', 'email']));
});


module.exports = router;
