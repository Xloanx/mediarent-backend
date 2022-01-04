const express = require('express');
const router = express.Router();
const mongodb = require('../mongo-vidly');



//Asynchronous CRUD Ops
async function createGenre(gen){
    const genre = new Genre({ genreName : gen });
    try {
        return await genre.save();
    } 
    catch (error) {
        return ("Couldn't write to mongodb...", error.message );
    } 
}

async function getGenres(){
    try {
        return await Genre
            .find()
            .sort('genreName')
            .select({genreName:1})
    } catch (error) {
        return ("Couldn't fetch from mongodb...", error.message);
    } 
}

async function getGenre(id){
    try {
        return await Genre.findById(id);
    } catch (error) {
        return ("Couldn't fetch from mongodb...", error.message);
    } 
}

async function updateGenre(id, name){
    try {
        return await Genre.findByIdAndUpdate(id, 
                                                {$set:{
                                                    genreName: name
                                                }},
                                                {new:true})
    } catch (error) {
        return ("Couldn't update Course on mongodb...", error )
    }
}

async function removeGenre(id){
    return await Genre.findByIdAndRemove( id );
}

router.get('/', async (req,res)=>{
    res.send(await getGenres());
})

router.get('/:id', async (req,res)=>{
    let genre = res.send(await getGenre(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is not valid");
    res.send(genre);
})

router.post('/', async (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    const result = await createGenre(req.body.genreName);
    console.log(result)
    res.send(result);
})

router.put('/:id', async (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    
    let genre = await updateGenre(req.params.id, req.body.genreName);
    if(!genre) return res.status(404).send("The Genre Id requested is not valid");

    res.send(`The Genre ${genre.genreName} was successfully edited`);
})

router.delete('/:id', async (req,res)=>{
    const genre = await removeGenre(req.params.id);
    if(!genre) return res.status(404).send("The Genre Id requested is invalid");
    res.send(`The Genre ${genre.genreName} was successfully deleted`);
})


module.exports = router;