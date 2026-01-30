const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const rateLimit = require('express-rate-limit');

// Rate limiting: 5 requests per 15 minutes per IP to prevent spam
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/contact', limiter, contactController.submitContactForm);

module.exports = router;
