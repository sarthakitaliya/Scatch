const Joi = require('joi');

module.exports.productSchema = Joi.object({
    image: Joi.object({
        url: Joi.string().required(),
        filename: Joi.string().required(),
    }).required,
    productname: Joi.string().required(),
    price: Joi.number().required().min(0),
    discount: Joi.number().default(0),
    bgcolor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).message('Invalid color code. It should start with # and be followed by 3 or 6 hexadecimal characters.').required(),
    panelcolor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).message('Invalid color code. It should start with # and be followed by 3 or 6 hexadecimal characters.').required(),
    textcolor: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).message('Invalid color code. It should start with # and be followed by 3 or 6 hexadecimal characters.').required(),
})

module.exports.signupSchema = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
})
