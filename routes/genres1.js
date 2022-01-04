const Joi = require('joi');
const express = require('express');
const router = express.Router();

const genres =[
    {id:1, genreName:"Action"},
    {id:2, genreName:"Comedy"},
    {id:3, genreName:"Thriller"},
    {id:4, genreName:"Horror"},
    {id:5, genreName:"Cartoon"},
    {id:6, genreName: "Crime & Mystery"},
    {id:7, genreName: "Adventure"},
    {id:8, genreName: "Fantasy"}
]

function genreValidation(userRequest){
    const schema = Joi.object({
        genreName : Joi.string().min(3).required()
    });
    return schema.validate({genreName: userRequest.body.genreName});
}

router.get('/', (req,res)=>{
    res.send(genres);
})

router.get('/:id', (req,res)=>{
    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is not valid");
    res.send(genre);
})

router.post('/', (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        genreName: req.body.genreName
    }

    genres.push(genre)
    res.send(`The Genre ${genre.genreName} was successfully created with id ${genre.id}`);
})

router.put('/:id', (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is not valid");

    genre.genreName = req.body.genreName;
    res.send(`The Genre ${genre.genreName} was successfully edited`);
})

router.delete('/:id', (req,res)=>{
    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is invalid");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(`The Genre ${genre.genreName} was successfully deleted`);
})


module.exports = router;