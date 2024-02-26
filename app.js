const mongoose = require('mongoose');

const genres = require('./routes/genres');
const customers = require('./routes/customers');
const express = require('express');


const mongoUrl = "mongodb://localhost/Movies";

mongoose.connect(mongoUrl)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error(' Could not connect to MongoDB...', err));

const app = express();
app.use(express.json());
app.use('/api/genres',genres);
app.use('/api/customers',customers);






const port = process.env.PORT || 3000;

app.listen(port,()=>{console.log(`Listen to port ${port}`);});


