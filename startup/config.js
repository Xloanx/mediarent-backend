const config = require('config');
const winston = require('../logger/winston');
const express = require('express');




module.exports = function(app){
//Gracefully exit App if JWT key isn't set 
if (!config.get('jwtPrivateKey')){
    throw new Error('FATAL ERROR: jwtPrivateKey not set!!!');
}

//Send Startup message to log & console
const port = process.env.PORT || 3000;
app.listen(port, 
    ()=>winston.info(
        `Server started.
        Port: ${port}
        Environment: ${config.get('name')} 
        Database Host: ${config.get('database.host')}`));

        
}
