const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, rentalValidation} = require('../models/rentals-model');
const {Customer} = require('../models/customers-model');
const {Movie} = require('../models/movies-model');
const auth = require('../middleware/auth');


// async function getRent(movieId = null, customerId = null){
//     if (movieId)   const movie = await Movie.movie.findById(movieId)
//     else 
//     try {
//         return await Movie.findById(id);
//     } catch (error) {
//         return ("Couldn't fetch from mongodb...", error.message);
//     } 
// }



//REST API Functions 

router.post('/', auth, async (req,res)=>{
    let {error} = rentalValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(400).send('Invalid Movie');

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) res.status(400).send('Invalid Customer');

    if (movie.numberInStock === 0) return res.send('Movie out of stock!');

    let rent = new Rental({ 
                            movie: {
                                _id : movie._id,
                                title: movie.title,
                                genre:{
                                    genreName: movie.genre.genreName
                                },
                                dailyRentalRate: movie.dailyRentalRate,
                                numberInStock : movie.numberInStock 
                            },
                            customer: {
                                _id : customer._id,
                                name: customer.name,
                                phone:customer.phone,
                                isGold:customer.isGold
                            },
                            rentalFee : req.body.rentalFee
    });
    try {
        rent = await rent.save();       //save to rent document
        movie.numberInStock--;          //reduce the number left
        movie.save();                   //save to movie document to reflect the number left
        res.send( rent );                    
    } 
    catch (error) {
        res.send("Couldn't write to database");
    } 
})

router.get('/', async (req,res)=>{
    try {
        res.send( await Rental
            .find()
            .select())
    } catch (error) {
        res.send("Couldn't fetch from database");
    } 
})

// router.get('/me', auth, async (req,res)=>{
//     let movie = res.send(await getMovie(req.params.id));
//     if(!movie) return res.status(404).send("invalid Movie Id");
//     res.send(movie);
// })




module.exports = router;