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
        password : req.body.password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
   //await user.save();
    try {
        await user.save();
    } 
    catch (error) {
        return ("Couldn't write to mongodb...", error.message );
    }
    //if we want to grant authentication automatically immediately 
    //after registration success, then we include jwt header
    //else comment out the first and second line and uncomment the last line 
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    //res.send(_.pick(user, ['_id', 'name', 'email']));
})


router.get('/me', auth, async (req,res)=>{
    try {
        //res.send(req.user._id);
        res.send( await User.findById(req.user._id).select('name email -passowrd'));
    } catch (error) {
        res.send("Couldn't fetch from mongodb!!!");
    } 
})



module.exports = router;