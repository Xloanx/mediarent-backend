const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fawn = require('fawn');
const {Rental, rentalValidation} = require('../models/rentals-model');
const {Customer} = require('../models/customers-model');
const {Movie} = require('../models/movies-model');


//Helper Functions for Asynchronous CRUD Ops

async function createRent(movieId, customerId, rentalFee){
    const movie = await Movie.findById(movieId);
    if (!movie) return 'Invalid Movie';

    const customer = await Customer.findById(customerId);
    if (!customer) return 'Invalid Customer';

    if (movie.numberInStock === 0) return 'Movie out of stock!';

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
                            rentalFee : rentalFee
    });
    try {
        rent = await rent.save();
        movie.numberInStock--;
        movie.save();
        return rent;
    } 
    catch (error) {
        return ("Couldn't write to database...", error.message );
    } 
}

async function getRent(){
    try {
        return await Rental
            .find()
            .select()
    } catch (error) {
        return ("Couldn't fetch from database...", error.message);
    } 
}

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

router.post('/', async (req,res)=>{
    let {error} = rentalValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await createRent( req.body.movieId, req.body.customerId, req.body.rentalFee );

    res.send(result);
})

router.get('/', async (req,res)=>{
    res.send(await getRent());
})

// router.get('/:id', async (req,res)=>{
//     let movie = res.send(await getMovie(req.params.id));
//     if(!movie) return res.status(404).send("invalid Movie Id");
//     res.send(movie);
// })




module.exports = router;