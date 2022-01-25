const express = require('express');
const router = express.Router();
const {User, userValidation} = require('../models/users-model');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');


router.post('/', async (req,res)=>{
    let {error} = userValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    let user  = await User.findOne({email : req.body.email})
    if (user) return res.status(400).send("User already exists!");

    user = new User({ 
        name : req.body.name, 
        email : req.body.email,
        password : req.body.password,
        isAdmin : req.body.isAdmin
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    //if we want to grant authentication automatically immediately 
    //after registration success, then we include jwt header
    //else comment out the first and second line and uncomment the last line 
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
    //res.send(_.pick(user, ['_id', 'name', 'email']));

})


router.get('/me', auth, async (req,res)=>{
    res.send( await User.findById(req.user.id).select({name:1, email:1, _id:0}));
})



module.exports = router;