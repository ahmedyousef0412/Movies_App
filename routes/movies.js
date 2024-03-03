const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middlewares/auth')
const isAdmin = require('../middlewares/admin');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");



//Get all movies
router.get('/', async (req, res) => {

  const movies = await Movie.find().sort("title");
  res.send(movies);

});

//Get Movie by Id
router.get('/:id', async (req, res) => {

  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send(`No movie found by id: ${req.params.id}`);

  res.send(movie);
});

//Create Movie
router.post('/', auth,async (req, res) => {

  const { error } = validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json(errors);
  }

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(404).send(`No genre found by id: ${req.body.genreId}`);



  const movie = new Movie({

    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    dailyRantalRate: req.body.dailyRantalRate,
    numberInStock: req.body.numberInStock
  });
  await movie.save();
  res.send(movie);
});


//Update Movie
router.put('/:id', auth,async (req, res) => {

  const { error } = validate(req.body);
  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json(errors);

  }
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRantalRate: req.body.dailyRantalRate
    }, { new: true });

  if (!movie)
    return res.status(404).send(`No movie found by id: ${req.body.id}`);


  res.send(movie);
});


//Delete Movie
router.delete('/:id',[auth.isAdmin] ,async (req, res) => {

  let movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie)
    return res.status(404).send(`No movie found by id: ${id}`);


  res.send(movie);
});


module.exports = router;