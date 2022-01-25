const winston = require('../logger/winston');
const morgan = require('morgan');
require('express-async-errors');


module.exports = function(app){

//Catch Uncaught Exceptions (Outside Express context)
//method 1
// process.on('uncaughtException', (ex)=>{
//     //winston.error(ex.message, ex);
//     winston.error(ex.message);
//     process.exit(1);
// })
//method 2
winston.exceptions.handle(winston.error('Exception or Unhandled Rejection Caught'))

//Catch unhandled rejections
process.on('unhandledRejection', (ex)=>{
    throw ex;
})


if(app.get('env') === 'development'){
    //app.use(morgan('tiny'));
    app.use(morgan('combined', { stream: winston.stream }));
    console.log('morgan enabled ...')
}
}



//simulate an uncaught & rejected exceptions
//throw new Error('Something Failed');
//const p =Promise.reject(new Error('something failed miserably'));
//p.then(()=> console.log('Done'));