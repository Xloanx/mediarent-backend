const express = require('express');
const router = express.Router();
const Joi = require('joi');
const {User} = require('../models/users-model');
const _ = require('lodash');
const bcrypt = require('bcrypt');


function authValidation(userRequest){
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9@]{3,30}$')).required()
    });
    return schema.validate({email: userRequest.body.email,
                            password: userRequest.body.password
                        });
}


router.post('/', async (req,res)=>{
    let {error} = authValidation(req);
    if (error) return res.status(400).send(error.details[0].message);

    let user  = await User.findOne({email : req.body.email})
    if (!user) return res.status(400).send("Invalid Email or Password!");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) res.status(400).send("Invalid Email or Password!");

    const token = user.generateAuthToken();
    
    res.header('x-auth-token', token).send(token);
})




module.exports = router;