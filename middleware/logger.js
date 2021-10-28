function log_middleware(req, res, next){
    console.log('I am the logger middleware');
    next();
}