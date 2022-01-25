const appRoot = require('app-root-path');
const winston = require('winston');
const { combine, timestamp, label, prettyPrint } = winston.format;
const config = require('config');
require('winston-mongodb');




const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6
  };



// define the custom settings for each transport (file, console)
const options = {
  file_err: {
    level: 'error',
    filename: `${appRoot}/logs/app_err.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  file_nerr: {
    level: 'info',
    filename: `${appRoot}/logs/app_nerr.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};



// instantiate a new Winston Logger with the settings defined above
//var logger = new winston.Logger({
const logger = winston.createLogger({
    format: combine(
        //label({ label: 'right meow!' }),
        timestamp(),
        prettyPrint()
      ),
  transports: [
    new winston.transports.File(options.file_err),
    new winston.transports.File(options.file_nerr),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

// logger.add(winston.transports.MongoDB, {
//     db: `mongodb://${config.get('database.host')}/vidlydb`, 
//     level : 'info'
// });

// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
  write: function(message, encoding) {
    // use the 'info' log level so the output will be picked up by both transports (file and console)
    logger.info(message);
  },
};




module.exports = logger;