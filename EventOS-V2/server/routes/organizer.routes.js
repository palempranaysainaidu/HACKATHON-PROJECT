const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth.middleware');
const {
  createEvent, getEvents, getEventById, updateEvent, deleteEvent, publishEvent,
  getTasks, addTask, updateTask, deleteTask,
  getBudget, addBudgetItem, updateBudgetItem, deleteBudgetItem,
  getApplications, acceptVolunteer, rejectVolunteer,
  getSponsors, addSponsor, updateSponsor, deleteSponsor,
  postAnnouncement, getAnnouncements,
  getAttendees, getLiveUpdates, postLiveUpdate
} = require('../controllers/organizer.controller');

router.use(protect);
router.use(requireRole('organizer'));

// Events
router.route('/events').get(getEvents).post(createEvent);
router.route('/events/:id').get(getEventById).patch(updateEvent).delete(deleteEvent);
router.post('/events/:id/publish', publishEvent);

// Tasks
router.route('/events/:id/tasks').get(getTasks).post(addTask);
router.route('/tasks/:taskId').patch(updateTask).delete(deleteTask);

// Budget
router.route('/events/:id/budget').get(getBudget).post(addBudgetItem);
router.route('/budget/:itemId').patch(updateBudgetItem).delete(deleteBudgetItem);

// Volunteers
router.get('/events/:id/applications', getApplications);
router.patch('/applications/:appId/accept', acceptVolunteer);
router.patch('/applications/:appId/reject', rejectVolunteer);

// Sponsors
router.route('/events/:id/sponsors').get(getSponsors).post(addSponsor);
router.route('/sponsors/:sponsorId').patch(updateSponsor).delete(deleteSponsor);

// Announcements
router.route('/events/:id/announcements').get(getAnnouncements).post(postAnnouncement);

// Attendees & Updates
router.get('/events/:id/attendees', getAttendees);
router.route('/events/:id/live-updates').get(getLiveUpdates).post(postLiveUpdate);

module.exports = router;
