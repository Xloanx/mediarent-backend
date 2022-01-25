const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('../startup/database');
const {Customer, customerValidation} = require('../models/customers-model');
const auth = require('../middleware/auth');
const admin_auth = require('../middleware/admin-auth');


router.get('/', async (req,res)=>{
        res.send( await Customer
            .find()
            .sort('name'));
})

router.get('/:id', async (req,res)=>{
        const customer = await Customer.findById(req.params.id);
        if(!customer) return res.status(404).send("Invalid Customer Id!!!");
        res.send(customer);
})

router.post('/', auth, async (req,res)=>{
    let {error} = customerValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = new Customer({ 
                                    name : req.body.name, 
                                    phone: req.body.phone, 
                                    isGold: req.body.isGold 
                    });
    res.send(await customer.save()); 
})

router.put('/:id', auth,  async (req,res)=>{
    let {error} = customerValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = await Customer.findById(req.params.id);
    if (!customer)  return res.status(404).send("Invalid Customer Id!!!");
    customer.set({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
    await customer.save();
    res.send(`The Customer, '${customer.name}' was successfully edited`);
})

router.delete('/:id', [auth, admin_auth],  async (req,res)=>{
        const customer = await Customer.findByIdAndRemove( req.params.id );
        if(!customer) return res.status(404).send("Invalid Customer Id!!!");
        res.send(`The Customer, '${customer.name}' was successfully deleted`);
})


module.exports = router;