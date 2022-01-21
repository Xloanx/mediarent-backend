const express = require('express');
const router = express.Router();
const {Movie, movieValidation} = require('../models/movies-model');
const {Genre} = require('../models/genres-model');



//Helper Functions for Asynchronous CRUD Ops

async function createMovie(title, genreId, numberInStock, dailyRentalRate ){
    const genre = await Genre.findById(genreId);
    if (!genre) return 'Invalid Genre';
    const movie = new Movie({ 
                            title : title, 
                            genre: {
                                _id : genre._id,
                                genreName: genre.genreName
                            }, 
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
            .populate('genre', 'genreName')
            .select('title genre numberInStock dailyRentalRate')
    } catch (error) {
        return ("Couldn't fetch from database...", error.message);
    } 
}

async function getMovie(id){
    try {
        return await Movie.findById(id);
    } catch (error) {
        return ("Couldn't fetch from mongodb...", error.message);
    } 
}

async function updateMovie(id, title, genreId, numberInStock, dailyRentalRate){
    try {
        const movie = await Movie.findById(id);
        if(!movie) return ;
        const genre = await Genre.findById(genreId);
        if(!genre) return;

        movie.title = title;
        //movie.genre._id = genreid;  
        movie.genre= {
            _id : genre._id,
            genreName: genre.genreName
        }                                      
        movie.numberInStock = numberInStock;
        movie.dailyRentalRate = dailyRentalRate;
        movie.save();
        return movie;
    } catch (error) {
        return ("Couldn't update movie on database...", error )
    }
}

async function removeMovie(id){
    return await Movie.findByIdAndRemove( id );
}




//REST API Functions 

router.post('/', async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await createMovie(
        req.body.title, 
        req.body.genreId, 
        req.body.numberInStock,
        req.body.dailyRentalRate
        );

    res.send(result);
})

router.get('/', async (req,res)=>{
    res.send(await getMovies());
})

router.get('/:id', async (req,res)=>{
    let movie = res.send(await getMovie(req.params.id));
    if(!movie) return res.status(404).send("invalid Movie Id");
    res.send(movie);
})

router.put('/:id', async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    
    let movie = await updateMovie(
                                req.params.id,
                                req.body.title, 
                                req.body.genreId, 
                                req.body.numberInStock,
                                req.body.dailyRentalRate
                            );
    if(!movie) return res.status(404).send("Invalid Movie Id");

    res.send(`The movie, "${movie.title}" was successfully edited`);
})

router.delete('/:id', async (req,res)=>{
    const movie = await removeMovie(req.params.id);
    if(!movie) return res.status(404).send("Invalid Movie Id");
    res.send(`The Movie, ${movie.title} was successfully deleted`);
})


module.exports = router;