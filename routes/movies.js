const express = require('express');
const router = express.Router();
const {Movie, movieValidation} = require('../models/movies-model');
const {Genre} = require('../models/genres-model');
const auth = require('../middleware/auth');


//REST API Functions 

router.post('/', auth, async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    try {
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.send('Invalid Genre');
    const movie = new Movie({ 
                            title : req.body.title, 
                            genre: {
                                _id : genre._id,
                                genreName: genre.genreName
                            }, 
                            numberInStock : req.body.numberInStock, 
                            dailyRentalRate: req.body.dailyRentalRate
    });
    res.send(await movie.save());
    } 
    catch (error) {
        res.send("Couldn't write to database...");
    } 
})



router.get('/', async (req,res)=>{
    try {
        res.send( await Movie
                        .find()
                        .populate('genre', 'genreName')
                        .select('title genre numberInStock dailyRentalRate'));
    } catch (error) {
        return ("Couldn't fetch movies from database!!!");
    } 
})



router.get('/:id', async (req,res)=>{
    try {
        const movie = await Movie.findById(req.params.id);
        if(!movie) return res.status(404).send("Invalid Movie Id!!!");
        res.send(movie);
    } catch (error) {
        res.send("Couldn't fetch from db!!!");
    } 
})



router.put('/:id', auth, async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const movie = await Movie.findById(req.params.id);
        if(!movie) return res.status(404).send("Invalid Movie Id");
        const genre = await Genre.findById(req.body.genreId);
        if(!genre) return res.status(404).send("Invalid Movie Id");

        movie.title = req.body.title;
        movie.genre= {
                    _id : genre._id,
                    genreName: genre.genreName
        }                                      
        movie.numberInStock = req.body.numberInStock;
        movie.dailyRentalRate =  req.body.dailyRentalRate;
        await movie.save();
        res.send(`The movie, "${movie.title}" was successfully edited`);
    } catch (error) {
        res.send("Couldn't update movie on database!!!");
    }
})



router.delete('/:id', auth, async (req,res)=>{
    try {
        const movie = await Movie.findByIdAndRemove( req.params.id );
        if(!movie) return res.status(404).send("Invalid Movie Id");
        res.send(`The Movie, '${movie.title}' was successfully deleted`);
    } catch (error) {
        res.send("Couldn't fetch the specified resource for deletion!!!")
    }

})


module.exports = router;