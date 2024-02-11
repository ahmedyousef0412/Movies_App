
const Joi = require('joi');
const courses = require('./routes/genres');
const express = require('express');

const app = express();
app.use(express.json());
app.use('/api/courses',courses);






const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log(`Listen to port ${port}`);});


function validateGenres(genre){
    let schema = Joi.object(
        {
            name: Joi.string().min(5).required()
        }
    );
    return schema.validate(genre, { abortEarly: false })
}