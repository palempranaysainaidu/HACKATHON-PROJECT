const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { registerForEvent, getRegistrationsByEvent } = require('../controllers/registration.controller');

router.post('/event/:eventId', registerForEvent);  // Public route
router.get('/event/:eventId', protect, getRegistrationsByEvent);

module.exports = router;
