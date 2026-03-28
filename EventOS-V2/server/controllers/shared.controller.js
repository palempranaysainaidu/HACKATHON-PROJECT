const User = require('../models/User');
const Notification = require('../models/Notification');
const Venue = require('../models/Venue');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, notifications });
  } catch (error) { next(error); }
};

exports.markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.markAllNotificationsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    res.json({ success: true });
  } catch (error) { next(error); }
};

exports.getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('name bio city organization profilePhoto role');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, city, organization, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, city, organization, bio }, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

exports.searchVenues = async (req, res, next) => {
  try {
    const { city, capacity, type } = req.query;
    const query = {};
    if (city) query.city = new RegExp(city, 'i');
    if (capacity) query.capacity = { $gte: Number(capacity) };
    if (type) query.type = type;
    
    const venues = await Venue.find(query).limit(20);
    res.json({ success: true, venues });
  } catch (error) { next(error); }
};

exports.getVenueDetails = async (req, res, next) => {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) return res.status(404).json({ message: 'Venue not found' });
    res.json({ success: true, venue });
  } catch (error) { next(error); }
};
