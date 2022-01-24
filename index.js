require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cors = require('cors');
const morgan = require('morgan')
const helmet = require('helmet');
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
//const logger = require('./middleware/logger');  //e.g. of custom middleware
const home = require('./routes/home');
const customers = require('./routes/customers');
const genres = require('./routes/genres');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const mongodb = require('./mongo-vidly');
const error = require('./middleware/error');
const winston = require('./logger/winston');


app.set('view engine', 'pug');
app.set('views', './views');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000']
}));
app.use('/', home);
app.use('/api/customers', customers);
app.use('/api/genres', genres);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);


if (!config.get('token.jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey not set!!!');
    process.exit(1);
}


if(app.get('env') === 'development'){
    //app.use(morgan('tiny'));
    app.use(morgan('combined', { stream: winston.stream }));
    console.log('morgan enabled ...')
}

console.log(`The environment Name : ${config.get('name')}`);
console.log(`The database is hosted on : ${config.get('database.host')}`);


const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`));
mongodb();