const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getBudgetByEvent, updateBudgetItem } = require('../controllers/budget.controller');

router.get('/event/:eventId', protect, getBudgetByEvent);
router.patch('/:id', protect, updateBudgetItem);

module.exports = router;
