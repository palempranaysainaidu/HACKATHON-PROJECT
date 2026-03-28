const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getEmailsByEvent, updateEmail, sendEmailDraft } = require('../controllers/email.controller');

router.get('/event/:eventId', protect, getEmailsByEvent);
router.patch('/:id', protect, updateEmail);
router.post('/:id/send', protect, sendEmailDraft);

module.exports = router;
