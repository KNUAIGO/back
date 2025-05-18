const Joi  = require('joi');

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(3).max(30).required(),
    age: Joi.number().integer().min(0).required(),
    phone: Joi.string().pattern(/^[0-9]{10,15}$/).required(),
    password: Joi.string().min(6).max(20).required(),
    region: Joi.string().min(3).max(100).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
});

module.exports = {
    registerSchema,
    loginSchema,
}