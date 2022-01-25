const express = require('express');
const router = express.Router();
const {Movie, movieValidation} = require('../models/movies-model');
const {Genre} = require('../models/genres-model');
const auth = require('../middleware/auth');
const admin_auth = require('../middleware/admin-auth');


//REST API Functions 

router.post('/', auth, async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
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
})



router.get('/', async (req,res)=>{
    res.send( await Movie
            .find()
            .populate('genre', 'genreName')
            .select('title genre numberInStock dailyRentalRate'));
})



router.get('/:id', async (req,res)=>{
    const movie = await Movie.findById(req.params.id);
    if(!movie) return res.status(404).send("Invalid Movie Id!!!");
    res.send(movie);
})



router.put('/:id', auth, async (req,res)=>{
    let {error} = movieValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
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
})



router.delete('/:id', [auth, admin_auth], async (req,res)=>{
        const movie = await Movie.findByIdAndRemove( req.params.id );
        if(!movie) return res.status(404).send("Invalid Movie Id");
        res.send(`The Movie, '${movie.title}' was successfully deleted`);

})


module.exports = router;