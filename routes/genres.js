const express = require('express');
const router = express.Router();
const mongodb = require('../mongo-vidly');
const {Genre, genreValidation} = require('../models/genres-model');
const auth = require('../middleware/auth');
const admin_auth = require('../middleware/admin-auth');


router.get('/', async (req,res)=>{
    try {
        return res.send(await Genre
            .find()
            .sort('genreName')
            .select({genreName:1}))
    } catch (error) {
        return res.send("Couldn't fetch from mongodb...");
    } 
})

router.get('/:id', async (req,res)=>{
    try {
        const genre = await Genre.findById(req.params.id);
        if(!genre) return res.status(404).send("The Genre Id requested is not valid");
        res.send(genre);
        } catch (error) {
            return ("Couldn't fetch from mongodb...");
    } 


})

router.post('/', auth, async (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({ genreName : req.body.genreName });
    try {
        res.send( await genre.save());
    } 
    catch (error) {
        return res.send("Couldn't write to mongodb...", error.message );
    } 
})

router.put('/:id', auth, async (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    try {
        const genre = await Genre
                            .findByIdAndUpdate(req.params.id, 
                                            {$set:{genreName: req.body.genreName}},
                                            {new:true}
                            );
        if(!genre) return res.status(404).send("invalid Genre Id!");
        res.send(`The Genre, '${genre.genreName}' was successfully edited`);
        } catch (error) {
            res.send("Couldn't update Course on mongodb...");
        }
})



router.delete('/:id', [auth, admin_auth], async (req,res)=>{
    const genre =  await Genre.findByIdAndRemove( req.params.id );
    if(!genre) return res.status(404).send("The Genre Id requested is invalid");
    res.send(`The Genre, '${genre.genreName}' was successfully deleted`);
})


module.exports = router;