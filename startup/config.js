const config = require('config');
///const express = require('express');




module.exports = function(app){
//Gracefully exit App if JWT key isn't set 
if (!config.get('jwtPrivateKey')){
    throw new Error('FATAL ERROR: jwtPrivateKey not set!!!');
}
       
}


