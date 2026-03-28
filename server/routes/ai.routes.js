const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const {
  initializeEvent,
  generatePlan,
  generateEmails,
  estimateBudget,
  predictRisks
} = require('../controllers/ai.controller');

router.post('/initialize', protect, initializeEvent);
router.post('/generate-plan/:eventId', protect, generatePlan);
router.post('/generate-emails/:eventId', protect, generateEmails);
router.post('/estimate-budget/:eventId', protect, estimateBudget);
router.post('/predict-risks/:eventId', protect, predictRisks);

module.exports = router;
