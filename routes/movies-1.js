const express = require('express');
const router = express.Router();
const mongodb = require('../mongo-vidly');
const {movieSchema, Movie, movieValidation} = require('../models/movies-model-1');
const {Genre} = require('../models/genres-model');



//Helper Functions for Asynchronous CRUD Ops
async function createMovie(title, genre, numberInStock=0, dailyRentalRate=0 ){
    const movie = new Movie({ 
        title : title, 
        genre: genre, 
        numberInStock : numberInStock, 
        dailyRentalRate: dailyRentalRate
    });
    try {
        return await movie.save();
    } 
    catch (error) {
        return ("Couldn't write to database...", error.message );
    } 
}

async function getMovies(){
    try {
        return await Movie
            .find()
            .populate('genre', 'genreName -_id')
            .select('title genre numberInStock dailyRentalRate')
    } catch (error) {
        return ("Couldn't fetch from database...", error.message);
    } 
}

async function updateMovie(id, title, genre, numberInStock = 0, dailyRentalRate = 0){
    try {
        const movie = await Movie.findById(id);
        if(!movie) return ;
        movie.title = title;
        movie.genre.genreName = genre;                                        
        movie.numberInStock = numberInStock;
        movie.dailyRentalRate = dailyRentalRate;
        movie.save();
        return movie;
    } catch (error) {
        return ("Couldn't update movie on database...", error )
    }
}

async function getMovie(id){
    try {
        return await Movie.findById(id);
    } catch (error) {
        return ("Couldn't fetch from database...", error.message);
    } 
}







//REST API Functions 
router.get('/', async (req,res)=>{
    res.send(await getMovies());
})

router.get('/:id', async (req,res)=>{
    let movie = await getMovie(req.params.id);
    if(!movie) return res.status(404).send("The Movie Id requested is not valid");
    res.send(movie);
})

router.post('/', async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await createMovie(
        req.body.title, 
        req.body.genre, 
        req.body.numberInStock,
        req.body.dailyRentalRate
        );

    console.log(result)
    res.send(result);
})


router.put('/:id', async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    
    let movie = await updateMovie(
                                req.params.id,
                                req.body.title, 
                                req.body.genre.genreName, 
                                req.body.numberInStock,
                                req.body.dailyRentalRate
                            );
    if(!movie) return res.status(404).send("The Movie Id requested is not valid");

    res.send(`The movie ${movie.title} was successfully edited`);
})



async function removeMovie(id){
    try {
        return await Movie.findByIdAndRemove( id );
    } catch (error) {
        console.log(error.message);
        return ("Couldn't delete the movie with the specified id from database...", error.message);
    }
}

router.delete('/:id', async (req,res)=>{
    const movie = await removeMovie(req.params.id);
    if(!movie) return res.status(404).send("The Movie Id requested is invalid");
    res.send(`The Movie, ${movie.title} was successfully deleted`);
})


module.exports = router;