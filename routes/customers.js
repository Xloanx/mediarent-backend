const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('../mongo-vidly');
const {Customer, customerValidation} = require('../models/customers-model');
const auth = require('../middleware/auth');
const admin_auth = require('../middleware/admin-auth');


router.get('/', async (req,res)=>{
    try {
        res.send( await Customer
            .find()
            .sort('name'));
    } catch (error) {
        res.send("Couldn't fetch Customers from mongodb...");
    } 
})

router.get('/:id', async (req,res)=>{
    try {
        const customer = await Customer.findById(req.params.id);
        if(!customer) return res.status(404).send("Invalid Customer Id!!!");
        res.send(customer);
    } catch (error) {
        res.send("Couldn't fetch Customer from mongodb...");
    } 
})

router.post('/', auth, async (req,res)=>{
    let {error} = customerValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    const customer = new Customer({ 
                                    name : req.body.name, 
                                    phone: req.body.phone, 
                                    isGold: req.body.isGold 
                    });
    try {
    res.send(await customer.save());
    } 
    catch (error) {
    res.send ("Couldn't write to mongodb...");
    } 
})

router.put('/:id', auth,  async (req,res)=>{
    let {error} = customerValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer)  return res.status(404).send("Invalid Customer Id!!!");
        customer.set({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        })
        await customer.save();
        res.send(`The Customer, '${customer.name}' was successfully edited`);
    } 
    catch (error) {
        res.send("Couldn't update Customer's details on db!!!");
    }
})

router.delete('/:id', [auth, admin_auth],  async (req,res)=>{
    try {
        const customer = await Customer.findByIdAndRemove( req.params.id );
        if(!customer) return res.status(404).send("Invalid Customer Id!!!");
        res.send(`The Customer, '${customer.name}' was successfully deleted`);
    } catch (error) {
        res.send("Couldn't delete the requested object from db!!!")
    }
})


module.exports = router;