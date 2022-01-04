const morgan = require('morgan')
const helmet = require('helmet');
const config = require('config');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');  //e.g. of custom middleware
const genres = require('./routes/genres');
const home = require('./routes/home');
const customers = require('./routes/customers');
const mongodb = require('./mongo-vidly');
const express = require('express');
const app = express();

app.set('view engine', 'pug');
app.set('views', './views');

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/', home);
//app.use(logger);

if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    console.log('morgan enabled ...')
}

console.log(`The environment Name : ${config.get('name')}`);
console.log(`The database is hosted on : ${config.get('database.host')} and the password is ${config.get('database.password')}`);


const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`));
mongodb();