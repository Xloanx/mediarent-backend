const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const config = require('config');
const winston = require('./logger/winston');
const app = express();

require('./startup/logging')(app);
require('./startup/config')(app);
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/prod')(app);


//view cofiguration
// app.set('view engine', 'pug');
// app.set('views', './views');

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors({    origin: ['http://localhost:3000']  }));





//Send Startup message to log & console
const port = process.env.PORT || 3000;
const server = app.listen(port, 
    ()=>winston.info(
        `Server started.
        Port: ${port}
        Environment: ${config.get('name')} 
        Database Host: ${config.get('database.db')}`)); 
 

module.exports = server ;