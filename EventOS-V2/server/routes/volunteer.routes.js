const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const {
  getOpenEvents, getEventDetails, applyForEvent, getMyApplications,
  getWorkspace, getMyTasks, updateTaskStatus, postLiveUpdate, getLiveUpdates,
  getAnnouncements, getChatHistory, markAttendance
} = require('../controllers/volunteer.controller');

router.use(protect);
router.use(requireRole('volunteer'));

router.get('/events', getOpenEvents);
router.get('/events/:id', getEventDetails);
router.post('/events/:id/apply', applyForEvent);
router.get('/applications', getMyApplications);

router.get('/events/:id/workspace', getWorkspace);
router.get('/events/:id/tasks', getMyTasks);
router.patch('/tasks/:taskId/status', updateTaskStatus);

router.route('/events/:id/live-updates').get(getLiveUpdates).post(postLiveUpdate);
router.get('/events/:id/announcements', getAnnouncements);
router.get('/events/:id/chat', getChatHistory);

router.post('/mark-attendance', markAttendance);

module.exports = router;
