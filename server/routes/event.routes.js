const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { createEvent, getEventById, getEventBySlug, getUserEvents, updateEvent } = require('../controllers/event.controller');

router.post('/create', protect, createEvent);
router.get('/slug/:slug', getEventBySlug);  // Public route
router.get('/', protect, getUserEvents);
router.get('/:id', protect, getEventById);
router.patch('/:id', protect, updateEvent);

module.exports = router;
