const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const app = express();

require('./startup/logging')(app);
require('./startup/config')(app);
require('./startup/routes')(app);
require('./startup/database')();


//view cofiguration
// app.set('view engine', 'pug');
// app.set('views', './views');

//middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
app.use(helmet());
app.use(cors({    origin: ['http://localhost:3000']  }));









