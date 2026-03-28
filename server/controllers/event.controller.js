const Event = require('../models/Event');

const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create({ ...req.body, userId: req.user._id });
    res.status(201).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

const getEventBySlug = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

const getUserEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found.' });
    }
    res.json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

module.exports = { createEvent, getEventById, getEventBySlug, getUserEvents, updateEvent };
