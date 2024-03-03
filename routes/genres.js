
const { Genre, validate } = require('../models/genre');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/admin');
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");



//Get All Genres
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

//Get Genre by Id
router.get("/:id", async (req, res) => {

  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send(`No genere found by id: ${req.body.id}`);

  res.send(genre);
});

//Create a new Genre
router.post("/", auth,async (req, res) => {
  let { error } = validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json(errors);
  }

  const genre = new Genre({ name: req.body.name });

  await genre.save();
  res.send(genre);
});

//Update Genre
router.put("/:id",auth, async (req, res) => {
  let { error } = validate(req.body);

  if (error) {
    const errors = error.details.map((e) => e.message);
    return res.status(400).json(errors);
  }

  let genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name, }, { new: true, });

  if (!genre)
    return res.status(404).send(`No genere found by id: ${req.body.id}`);

  res.send(genre);
});

//Delete Genre
router.delete('/:id',[auth,isAdmin] ,async (req, res) => {
  try {

    const genre = await Genre.findByIdAndDelete(req.params.id);

    if (!genre) {
      return res.status(404).send('Genre not found');
    }

    res.send(genre);
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).send('Error deleting genre: ' + err.message);
  }
});

module.exports = router;
