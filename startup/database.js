const config = require('config');
const mongoose = require('mongoose');
const winston = require('../logger/winston');

module.exports = async function() {
        const db = config.get('database.db');
        await mongoose.connect(db);
        winston.info(`Connected to ${db}`);
}

 

