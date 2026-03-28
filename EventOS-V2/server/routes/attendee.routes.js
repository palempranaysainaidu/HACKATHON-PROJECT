const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const {
  getBrowseEvents, getEventDetail, registerForEvent,
  getMyRegistrations, getRegistrationDetail, submitFeedback, getPublicUpdates
} = require('../controllers/attendee.controller');

router.use(protect);
router.use(requireRole('attendee'));

router.get('/events', getBrowseEvents);
router.get('/events/:slug', getEventDetail);
router.post('/events/:id/register', registerForEvent);

router.get('/registrations', getMyRegistrations);
router.get('/registrations/:id', getRegistrationDetail);
router.post('/registrations/:id/feedback', submitFeedback);

router.get('/events/:id/updates', getPublicUpdates);

module.exports = router;
