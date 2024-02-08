
const Joi = require('joi');

const express = require('express');

const app = express();
app.use(express.json());


//api/genres

const genres = [
    {id: 1,name: 'Action'},
    {id: 2,name: 'Adventure'},
    {id: 3,name: 'Animation'},
    {id: 4,name: 'Comedy'},
    {id: 5,name: 'Crime'},
    {id: 6,name: 'Documentary'}
];

//Get All Genres
app.get('/api/genres',(req,res)=>{
    res.send(genres);
})

//Get Genre by Id
app.get('/api/genres/:id',(req,res)=>{


    const id = parseInt(req.params.id);

    const genre = genres.find(g=>g.id === id);

    if(!genre)
    return res.status(404).send(`No genere found by id: ${id}`);

    res.send(genre);
});

//Create a new Genre
app.post('/api/genres',(req,res)=>{

let newGenre = {
    id: genres.length + 1,
    name: req.body.name
};

let {error} = validateGenres(req.body);

if(error){
    const errors = error.details.map(e =>e.message);
   return res.status(400).json(errors)
}

genres.push(newGenre);

res.send(newGenre);

});


//Update Genre
app.put('/api/genres/:id',(req,res)=>{

    let id = parseInt(req.params.id);

    let genre = genres.find(g => g.id === id);

    if(!genre)
    return res.status(404).send(`No genere found by id: ${id}`);

    genre.name = req.body.name;

    let{error} = validateGenres(req.body);

    if (error) {
        const errors = error.details.map(error => error.message);
       return res.status(400).json({ errors });
    }


    res.send(genre);


});

//Delete Genre
app.delete('/api/genres/:id',(req,res)=>{

    let id = parseInt(req.params.id);

    let genre = genres.find(g => g.id === id);

    if(!genre)
    return res.status(404).send(`No genere found by id: ${id}`);

    let index = genres.indexOf(genre);

    genres.splice(index,1);

    res.send(genre);

});


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