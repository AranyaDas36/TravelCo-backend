const express = require('express');
const {authMiddleware} = require('./../middleware/authMiddleware')

const router = express.Router();
const contactController = require('./../controllers/contactController'); // Adjust the path to your controller

// Route to handle contact form submission
router.post('/submit', authMiddleware, contactController.submitContact);

module.exports = router;
