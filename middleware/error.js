const winston = require('../logger/winston');

module.exports = function(err, req, res, next){
    winston.log('error', err.message);
    // winston.info(err.message, err); //error message + Metadata
    //winston.log('info', err.message);  //Just error Message
    res.status(500).send("Action on database Failed!!!")
}