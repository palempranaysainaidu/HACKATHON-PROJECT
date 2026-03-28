const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getTasksByEvent, createTask, updateTask, deleteTask } = require('../controllers/task.controller');

router.get('/event/:eventId', protect, getTasksByEvent);
router.post('/', protect, createTask);
router.patch('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;
