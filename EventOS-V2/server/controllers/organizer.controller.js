const Event = require('../models/Event');
const Task = require('../models/Task');
const Budget = require('../models/Budget');
const VolunteerApplication = require('../models/VolunteerApplication');
const Sponsor = require('../models/Sponsor');
const Announcement = require('../models/Announcement');
const AttendeeRegistration = require('../models/AttendeeRegistration');
const LiveUpdate = require('../models/LiveUpdate');
const { generateSlug } = require('../utils/slugGenerator');
const { generateIdCard } = require('../utils/idCardGenerator');

const checkOwnership = (event, req, res) => {
  if (event.organizerId.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: 'Not authorized for this event' });
    return false;
  }
  return true;
};

// ================= EVENTS =================
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizerId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (err) { next(err); }
};

exports.createEvent = async (req, res, next) => {
  try {
    const slug = generateSlug(req.body.name);
    const event = await Event.create({ ...req.body, organizerId: req.user._id, slug });
    res.status(201).json({ success: true, event });
  } catch (err) { next(err); }
};

exports.getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!checkOwnership(event, req, res)) return;
    res.json({ success: true, event });
  } catch (err) { next(err); }
};

exports.updateEvent = async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (!checkOwnership(event, req, res)) return;
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, event });
  } catch (err) { next(err); }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (!checkOwnership(event, req, res)) return;
    await event.deleteOne();
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) { next(err); }
};

exports.publishEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Not found' });
    if (!checkOwnership(event, req, res)) return;
    
    // Payment fee logic simulated
    if (event.expectedAudience > 100 && !event.platformFeePaid) {
       // Ideally verify payment intent here
       event.platformFeePaid = true; 
    }
    
    event.status = 'open';
    await event.save();
    res.json({ success: true, event });
  } catch (err) { next(err); }
};

// ================= TASKS =================
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ eventId: req.params.id }).populate('assignedTo', 'name profilePhoto');
    res.json({ success: true, tasks });
  } catch (err) { next(err); }
};

exports.addTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, eventId: req.params.id, createdBy: 'organizer' });
    res.status(201).json({ success: true, task });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true });
    res.json({ success: true, task });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId);
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
};

// ================= BUDGET =================
exports.getBudget = async (req, res, next) => {
  try {
    const items = await Budget.find({ eventId: req.params.id });
    res.json({ success: true, items });
  } catch (err) { next(err); }
};

exports.addBudgetItem = async (req, res, next) => {
  try {
    const item = await Budget.create({ ...req.body, eventId: req.params.id });
    res.status(201).json({ success: true, item });
  } catch (err) { next(err); }
};

exports.updateBudgetItem = async (req, res, next) => {
  try {
    const item = await Budget.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
    res.json({ success: true, item });
  } catch (err) { next(err); }
};

exports.deleteBudgetItem = async (req, res, next) => {
  try {
    await Budget.findByIdAndDelete(req.params.itemId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
};

// ================= VOLUNTEERS =================
exports.getApplications = async (req, res, next) => {
  try {
    const apps = await VolunteerApplication.find({ eventId: req.params.id }).populate('volunteerId', 'name city profilePhoto email phone');
    res.json({ success: true, applications: apps });
  } catch (err) { next(err); }
};

exports.acceptVolunteer = async (req, res, next) => {
  try {
    const app = await VolunteerApplication.findById(req.params.appId).populate('volunteerId');
    app.status = 'accepted';
    app.respondedAt = Date.now();
    app.volunteerId_card = await generateIdCard(app.volunteerId, {}, 'volunteer');
    // Notification logic would go here
    await app.save();
    res.json({ success: true, application: app });
  } catch (err) { next(err); }
};

exports.rejectVolunteer = async (req, res, next) => {
  try {
    const app = await VolunteerApplication.findByIdAndUpdate(req.params.appId, { status: 'rejected', respondedAt: Date.now() }, { new: true });
    res.json({ success: true, application: app });
  } catch (err) { next(err); }
};

// ================= SPONSORS =================
exports.getSponsors = async (req, res, next) => {
  try {
    const sponsors = await Sponsor.find({ eventId: req.params.id });
    res.json({ success: true, sponsors });
  } catch (err) { next(err); }
};

exports.addSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.create({ ...req.body, eventId: req.params.id });
    res.status(201).json({ success: true, sponsor });
  } catch (err) { next(err); }
};

exports.updateSponsor = async (req, res, next) => {
  try {
    const sponsor = await Sponsor.findByIdAndUpdate(req.params.sponsorId, req.body, { new: true });
    res.json({ success: true, sponsor });
  } catch (err) { next(err); }
};

exports.deleteSponsor = async (req, res, next) => {
  try {
    await Sponsor.findByIdAndDelete(req.params.sponsorId);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) { next(err); }
};

// ================= ANNOUNCEMENTS =================
exports.getAnnouncements = async (req, res, next) => {
  try {
    const annts = await Announcement.find({ eventId: req.params.id }).sort({ createdAt: -1 });
    res.json({ success: true, announcements: annts });
  } catch (err) { next(err); }
};

exports.postAnnouncement = async (req, res, next) => {
  try {
    const annt = await Announcement.create({ ...req.body, eventId: req.params.id, createdBy: req.user._id });
    res.status(201).json({ success: true, announcement: annt });
  } catch (err) { next(err); }
};

// ================= ATTENDEES & UPDATES =================
exports.getAttendees = async (req, res, next) => {
  try {
    const attendees = await AttendeeRegistration.find({ eventId: req.params.id }).populate('attendeeId', 'name email phone');
    res.json({ success: true, attendees });
  } catch (err) { next(err); }
};

exports.getLiveUpdates = async (req, res, next) => {
  try {
    const updates = await LiveUpdate.find({ eventId: req.params.id }).populate('postedBy', 'name role').sort({ createdAt: -1 });
    res.json({ success: true, updates });
  } catch (err) { next(err); }
};

exports.postLiveUpdate = async (req, res, next) => {
  try {
    const update = await LiveUpdate.create({
      eventId: req.params.id,
      postedBy: req.user._id,
      content: req.body.content,
      type: req.body.type || 'announcement',
      isVisibleToAttendees: true
    });
    const populatedUpdate = await update.populate('postedBy', 'name role');
    res.status(201).json({ success: true, update: populatedUpdate });
  } catch (err) { next(err); }
};
