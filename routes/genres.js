
const express = require('express');
const router = express.Router();

const genres = [
    {id: 1,name: 'Action'},
    {id: 2,name: 'Adventure'},
    {id: 3,name: 'Animation'},
    {id: 4,name: 'Comedy'},
    {id: 5,name: 'Crime'},
    {id: 6,name: 'Documentary'}
];



//Get All Genres
router.get('/',(req,res)=>{
    res.send(genres);
})

//Get Genre by Id
router.get('/:id',(req,res)=>{


    const id = parseInt(req.params.id);

    const genre = genres.find(g=>g.id === id);

    if(!genre)
    return res.status(404).send(`No genere found by id: ${id}`);

    res.send(genre);
});

//Create a new Genre
router.post('/',(req,res)=>{

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
router.put('/:id',(req,res)=>{

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
router.delete('/:id',(req,res)=>{

    let id = parseInt(req.params.id);

    let genre = genres.find(g => g.id === id);

    if(!genre)
    return res.status(404).send(`No genere found by id: ${id}`);

    let index = genres.indexOf(genre);

    genres.splice(index,1);

    res.send(genre);

});


module.exports =router;