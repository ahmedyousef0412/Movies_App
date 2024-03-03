const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');

const express = require('express');


const mongoUrl = 'mongodb+srv://ahmedyousef0412:xWZSvvm47ca1ijO1@ahmed-dev.szgixhe.mongodb.net/Movies'


if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR : jwtPrivateKey is not defined');
    process.exit(1);
}

mongoose.connect(mongoUrl)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(' Could not connect to MongoDB...', err));




const app = express();
app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);
app.use('/api/movies',movies);
app.use('/api/rentals',rentals);
app.use('/api/users',users);
app.use('/api/auth',auth);






const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log(`Listen to port ${port}`);});


