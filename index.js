// const genreServices = require('./services/genreServices');
// genreServices.app;
const express = require('express');
const morgan = require('morgan')
const helmet = require('helmet');
const config = require('config');
const Joi = require('joi');
const logger = require('./middleware/logger');  //e.g. of custom middleware

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());

//app.use(logger);

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('morgan enabled ...')
}

console.log(`The environment Name : ${config.get('name')}`);
console.log(`The database is hosted on : ${config.get('database.host')} and the password is ${config.get('database.password')}`);


const genres =[
    {id:1, genreName:"Action"},
    {id:2, genreName:"Comedy"},
    {id:3, genreName:"Thriller"},
    {id:4, genreName:"Horror"},
    {id:5, genreName:"Cartoon"},
    {"id": 6, "genreName": "Crime & Mystery"},
    {"id": 7, "genreName": "Adventure"},
    {"id": 8, "genreName": "Fantasy"}
]

function genreValidation(userRequest){
    const schema = Joi.object({
        genreName : Joi.string().min(3).required()
    });
    return schema.validate({genreName: userRequest.body.genreName});
}

app.get('/api/genres', (req,res)=>{
    res.send(genres);
})

app.get('/api/genres/:id', (req,res)=>{
    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is not valid");
    res.send(genre);
})

app.post('/api/genres/', (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    const genre = {
        id: genres.length + 1,
        genreName: req.body.genreName
    }

    genres.push(genre)
    res.send(`The Genre ${genre.genreName} was successfully created with id ${genre.id}`);
})

app.put('/api/genres/:id', (req,res)=>{
    let {error} = genreValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is not valid");

    genre.genreName = req.body.genreName;
    res.send(`The Genre ${genre.genreName} was successfully edited`);
})

app.delete('/api/genres/:id', (req,res)=>{
    let genre = genres.find(g => g.id === parseInt(req.params.id));
    if(!genre) return res.status(404).send("The Genre Id requested is invalid");

    const index = genres.indexOf(genre);
    genres.splice(index, 1);
    res.send(`The Genre ${genre.genreName} was successfully deleted`);
})

//module.exports = app;

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`));