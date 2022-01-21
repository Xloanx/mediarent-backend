const express = require('express');
const router = express.Router();
const {User, userValidation} = require('../models/users-model');
const _ = require('lodash');




async function getUsers(){
    try {
        return await User
            .find()
            .sort('name')
            .select("name email phone isAdmin")
    } catch (error) {
        return ("Couldn't fetch from mongodb...", error.message);
    } 
}



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
   //await user.save();
    try {
        await user.save();
    } 
    catch (error) {
        return ("Couldn't write to mongodb...", error.message );
    } 
    res.send(_.pick(user, ['name', 'email']));
})


router.get('/', async (req,res)=>{
    res.send(await getUsers());
})



module.exports = router;