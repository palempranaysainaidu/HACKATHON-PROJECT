const Event = require('../models/Event');
const VolunteerApplication = require('../models/VolunteerApplication');
const Task = require('../models/Task');
const LiveUpdate = require('../models/LiveUpdate');
const ChatMessage = require('../models/ChatMessage');
const Announcement = require('../models/Announcement');
const AttendeeRegistration = require('../models/AttendeeRegistration');

exports.getOpenEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: { $in: ['open', 'ongoing'] } }).sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) { next(err); }
};

exports.getEventDetails = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizerId', 'name organization profilePhoto');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) { next(err); }
};

exports.applyForEvent = async (req, res, next) => {
  try {
    const { skills, availability, motivation, resumeUrl } = req.body;
    const existing = await VolunteerApplication.findOne({ eventId: req.params.id, volunteerId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already applied' });

    const app = await VolunteerApplication.create({
      eventId: req.params.id, volunteerId: req.user._id,
      skills, availability, motivation, resumeUrl
    });
    res.status(201).json({ success: true, application: app });
  } catch (err) { next(err); }
};

exports.getMyApplications = async (req, res, next) => {
  try {
    const apps = await VolunteerApplication.find({ volunteerId: req.user._id }).populate('eventId', 'name date city organizerId status coverImage');
    res.json({ success: true, applications: apps });
  } catch (err) { next(err); }
};

const checkAccepted = async (eventId, userId) => {
  return await VolunteerApplication.findOne({ eventId, volunteerId: userId, status: 'accepted' });
};

exports.getWorkspace = async (req, res, next) => {
  try {
    const app = await checkAccepted(req.params.id, req.user._id);
    if (!app) return res.status(403).json({ message: 'Not accepted for this event' });
    res.json({ success: true, application: app });
  } catch (err) { next(err); }
};

exports.getMyTasks = async (req, res, next) => {
  try {
    if (!await checkAccepted(req.params.id, req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const tasks = await Task.find({ eventId: req.params.id, assignedTo: req.user._id });
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate({ _id: req.params.taskId, assignedTo: req.user._id }, { status: req.body.status }, { new: true });
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.postLiveUpdate = async (req, res, next) => {
  try {
    if (!await checkAccepted(req.params.id, req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const update = await LiveUpdate.create({ ...req.body, eventId: req.params.id, postedBy: req.user._id });
    res.status(201).json({ success: true, update });
  } catch (err) { next(err); }
};

exports.getLiveUpdates = async (req, res, next) => {
  try {
    if (!await checkAccepted(req.params.id, req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const updates = await LiveUpdate.find({ eventId: req.params.id }).populate('postedBy', 'name profilePhoto role').sort({ createdAt: -1 });
    res.json({ success: true, updates });
  } catch (err) { next(err); }
};

exports.getAnnouncements = async (req, res, next) => {
  try {
     if (!await checkAccepted(req.params.id, req.user._id)) return res.status(403).json({ message: 'Forbidden' });
     const annts = await Announcement.find({ eventId: req.params.id, targetRoles: { $in: ['volunteer', 'all'] } }).sort({ createdAt: -1 });
     res.json({ success: true, announcements: annts });
  } catch (err) { next(err); }
};

exports.getChatHistory = async (req, res, next) => {
  try {
    if (!await checkAccepted(req.params.id, req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    const messages = await ChatMessage.find({ eventId: req.params.id }).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, messages: messages.reverse() });
  } catch (err) { next(err); }
};

exports.markAttendance = async (req, res, next) => {
  try {
    const { registrationCode, eventId } = req.body;
    if (!await checkAccepted(eventId, req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    
    let reg = await AttendeeRegistration.findOne({ registrationCode, eventId }).populate('attendeeId', 'name');
    if (!reg) return res.status(404).json({ message: 'Registration code not found for this event' });
    
    if (reg.attended) return res.status(400).json({ message: 'Attendee already marked present' });
    
    reg.attended = true;
    reg.markedPresentBy = req.user._id;
    reg.markedPresentAt = Date.now();
    await reg.save();
    
    res.json({ success: true, attendee: reg.attendeeId, message: 'Attendance confirmed' });
  } catch (err) { next(err); }
};
