
const {Customer,validate} = require('../models/customer');

const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");


//GetAll Customers
router.get('/', async (req, res) => {

    const customers = await Customer.find().sort("name");
    res.send(customers);

});

//GetCustomer ById
router.get('/:id', async (req, res) => {

    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send({ message: 'Customer not found' });

    res.send(customer);
})

//Create Customer

router.post('/', async (req, res) => {

    let { error } =validate(req.body);

    if (error) {
        const errors = error.details.map(e => e.message);
        return res.status(400).send(errors);
    }

    let customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });
    customer = await customer.save();
    res.send(customer);
});


//Update Customer

router.put('/:id', async (req, res) => {
    let { error } = validate(req.body);

    if (error) {
        const errors = error.details.map(e => e.message);
        return res.status(400).send(errors);
    }


    let customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true });

    if (!customer) return res.status(404).send({ message: 'Customer not found' });

    res.send(customer);

});

//Delete Customer
router.delete('/:id',async(req,res)=>{

    try {
        
        let customer = await Customer.findByIdAndDelete(req.params.id);
  
      if (!customer) {
        return res.status(404).send('Customer not found');
      }
  
      res.send(customer);
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting customer: ' + err.message);
    }
});


module.exports = router;
