const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const mongodb = require('../mongo-vidly');
const {Customer, customerValidation} = require('../models/customers-model');


//Asynchronous CRUD Ops routes
async function createCustomer(name, phone, gold){
    const customer = new Customer({ name : name,
                                    phone: phone,
                                    isGold: gold });
    try {
        return await customer.save();
    } 
    catch (error) {
        return ("Couldn't write to mongodb...", error.message );
    } 
}

async function getCustomers(){
    try {
        return await Customer
            .find()
            .sort('name')
    } catch (error) {
        return ("Couldn't fetch Customers from mongodb...", error.message);
    } 
}

async function getCustomer(id){
    try {
        return await Customer.findById(id);
    } catch (error) {
        return ("Couldn't fetch Customer from mongodb...", error.message);
    } 
}

async function updateCustomer(id, ...otherDetails){
    try {
        const customer = await Customer.findById(id);
        if (!customer)  return ;   //returns null when no customer is found
        customer.set({
            name: otherDetails[0],
            phone: otherDetails[1],
            isGold: otherDetails[2]
        })
        return await customer.save();
        //return customer;
    } 
    catch (error) {
        return ("Couldn't update Customer's details on mongodb...", error.message);
    }
}


async function removeCustomer(id){
    return await Customer.findByIdAndRemove( id );
}




//routes

router.get('/', async (req,res)=>{
    res.send(await getCustomers());
})

router.get('/:id', async (req,res)=>{
    let customer = res.send(await getCustomer(req.params.id));
    if(!customer) return res.status(404).send("The Customer Id requested is not valid");
    res.send(customer);
})

router.post('/', async (req,res)=>{
    let {error} = customerValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    res.send(await createCustomer(req.body.name, req.body.phone, req.body.isGold));
})

router.put('/:id', async (req,res)=>{
    let {error} = customerValidation(req);
    if (error) return res.status(400).send(error.details[0].message);
    
    let customer = await updateCustomer(req.params.id, req.body.name, req.body.phone, req.body.isGold);
    if(!customer) return res.status(404).send("The Customer Id requested is not valid");
    
    res.send(`The Customer ${customer.name} was successfully edited`);
})

router.delete('/:id', async (req,res)=>{
    const customer = await removeCustomer(req.params.id);
    if(!customer) return res.status(404).send("The Customer Id requested is invalid");
    res.send(`The Customer ${customer.name} was successfully deleted`);
})


module.exports = router;