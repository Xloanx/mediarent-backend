const config = require('config');
const mongoose = require('mongoose');
const winston = require('../logger/winston');

module.exports = async function() {
        await mongoose.connect(`mongodb://${config.get('database.host')}/vidlydb`);
        winston.info('Connected to mongodb...');
}

 

