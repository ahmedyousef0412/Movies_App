const Joi = require('joi');
const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        max: 25,
        trim: true
    },
    isGold: {
        type: Boolean,
        
        default: false
    },
    phone: {
        type: String,
        required: true,
        minlength: 11,
        maxlength: 11,
        trim: true
    }
});
const Customer = mongoose.model("Customer", customerSchema);


function validateCustomers(customer) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(25).required(),
        isGold: Joi.boolean(),
        phone: Joi.string().length(11).required()
    });

    return schema.validate(customer, { abortEarly: false });
}

exports.Customer = Customer;
exports.validate = validateCustomers;
