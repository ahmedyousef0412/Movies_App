const { Movie } = require('../models/movie');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const express = require("express");
const auth = require('../middlewares/auth')

const mongoose = require("mongoose");
const router = express.Router();

//Get All Rentals

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});




//Get Rental by Id
router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);

    if (!rental) return res.status(404).send('The rental with the given ID was not found.');

    res.send(rental);
});


//Create Rental



// router.post('/', async (req, res) => {

//     const { error } = validate(req.body, res);
//     if (error) {
//         const errors = error.details.map(e => e.message);
//         return res.status(400).send(errors);
//     }

//     try {
//         const customer = await Customer.findById(req.body.customerId);
//         if (!customer) return res.status(404).send('The customer with the given ID was not found.');

//         const movie = await Movie.findById(req.body.movieId);
//         if (!movie) return res.status(404).send('The movie with the given ID was not found.');

//         if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');



//         const rental = new Rental({
//             customer: {
//                 _id: customer._id,
//                 name: customer.name,
//                 phone: customer.phone
//             },
//             movie: {
//                 _id: movie._id,
//                 title: movie.title,
//                 dailyRentalRate: movie.dailyRantalRate
//             }
//         });


//         await rental.save();

//         movie.numberInStock--;
//         movie.save();

//         res.send(rental);
//     } catch (error) {
//         console.error('Error processing rental:', error);
//         res.status(500).send('Internal server error');
//     }
// });




router.post('/', auth,async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { error } = validate(req.body, res);
        if (error) {
            const errors = error.details.map(e => e.message);
            return res.status(400).send(errors);
        }

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(404).send('The customer with the given ID was not found.');

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(404).send('The movie with the given ID was not found.');

        if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRantalRate
            }
        });

        rental = await rental.save({ session });

        movie.numberInStock--;
        await movie.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.send(rental);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Error processing rental:', error);
        res.status(500).send('Internal server error');
    }
});



module.exports = router; 
