const express = require('express');
const router = express.Router();
const { getNotifications, markNotificationRead, markAllNotificationsRead, getPublicProfile, updateProfile, searchVenues, getVenueDetails } = require('../controllers/shared.controller');
const { protect } = require('../middleware/auth.middleware');

// Public
router.get('/users/:id/public-profile', getPublicProfile);
router.get('/venues', searchVenues);
router.get('/venues/:id', getVenueDetails);

// Protected
router.use(protect);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);
router.patch('/notifications/read-all', markAllNotificationsRead);
router.patch('/settings/profile', updateProfile);

module.exports = router;
