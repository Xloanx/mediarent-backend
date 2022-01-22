const {User} = require('../models/users-model');

module.exports = function (req, res, next){
if (!req.user.isAdmin) return res.status(403).send("Access Denied for you on administrative functions!!!");
next();
}