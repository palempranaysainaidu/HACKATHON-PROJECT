const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const {
  initializeEvent, generatePlan, generateEmails, estimateBudget,
  predictRisks, assignVolunteerRoles, suggestVenues, assignTasksToVolunteers
} = require('../controllers/ai.controller');

router.use(protect);
router.use(requireRole('organizer')); // All AI routes are for Organizer

router.post('/initialize', initializeEvent);
router.post('/generate-plan/:eventId', generatePlan);
router.post('/generate-emails/:eventId', generateEmails);
router.post('/estimate-budget/:eventId', estimateBudget);
router.post('/predict-risks/:eventId', predictRisks);
router.post('/assign-volunteer-roles/:eventId', assignVolunteerRoles);
router.post('/assign-tasks/:eventId', assignTasksToVolunteers);
router.post('/suggest-venues', suggestVenues);

module.exports = router;
