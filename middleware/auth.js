const req = require("express/lib/request");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const config = require('config');


module.exports = function (req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Access Denied. No Token Provided!");

    try {
        const decoded = jwt.verify(token, config.get('token.jwtPrivateKey'));
        req.user = decoded;
        next();      
    } catch (error) {
        return res.status(400).send( "Access Denied. Invalid Token Provided!");
    }

}