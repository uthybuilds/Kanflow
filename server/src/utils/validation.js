const Joi = require('joi');

const contactSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.empty': 'Name is required',
    'string.min': 'Name should be at least 2 characters',
    'string.max': 'Name should be less than 50 characters'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address'
  }),
  subject: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Topic is required',
  }),
  message: Joi.string().min(10).max(5000).required().messages({
    'string.empty': 'Message is required',
    'string.min': 'Message should be at least 10 characters'
  })
});

const validateContact = (data) => {
  return contactSchema.validate(data, { abortEarly: false });
};

module.exports = { validateContact };
