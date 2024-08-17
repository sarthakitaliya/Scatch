const Joi = require('joi');

module.exports.productSchema = Joi.object({
    image: Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().required(),
    }).required(),
    productname: Joi.string().required(),
    price: Joi.number().required().min(0),
    discount: Joi.number().default(0),
    bgcolor: Joi.string().required(),
    panelcolor: Joi.string().required(),
    textcolor: Joi.string().required(),
})

module.exports.signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})
