const Event = require('../models/Event');
const AttendeeRegistration = require('../models/AttendeeRegistration');
const LiveUpdate = require('../models/LiveUpdate');

const generateRegCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

exports.getBrowseEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ status: 'open' }).populate('organizerId', 'name organization').sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) { next(err); }
};

exports.getEventDetail = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug }).populate('organizerId', 'name organization');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ success: true, event });
  } catch (err) { next(err); }
};

exports.registerForEvent = async (req, res, next) => {
  try {
    const { wantsFood, wantsTransport, numberOfGuests, totalCost } = req.body;
    
    const existing = await AttendeeRegistration.findOne({ eventId: req.params.id, attendeeId: req.user._id });
    if (existing) return res.status(400).json({ message: 'Already registered' });

    const code = generateRegCode();
    // In production, Stripe intent goes here. Mocking automatic success.
    const paymentStatus = totalCost > 0 ? 'paid' : 'free'; 
    
    const reg = await AttendeeRegistration.create({
      eventId: req.params.id,
      attendeeId: req.user._id,
      registrationCode: code,
      wantsFood, wantsTransport, numberOfGuests, totalCost,
      paymentStatus,
      idCardUrl: "https://res.cloudinary.com/eventos/image/upload/mock-attendee-id.pdf"
    });
    
    res.status(201).json({ success: true, registration: reg });
  } catch (err) { next(err); }
};

exports.getMyRegistrations = async (req, res, next) => {
  try {
    const regs = await AttendeeRegistration.find({ attendeeId: req.user._id }).populate('eventId', 'name date city status coverImage slug').sort({ registeredAt: -1 });
    res.json({ success: true, registrations: regs });
  } catch (err) { next(err); }
};

exports.getRegistrationDetail = async (req, res, next) => {
  try {
    const reg = await AttendeeRegistration.findOne({ _id: req.params.id, attendeeId: req.user._id }).populate('eventId');
    if (!reg) return res.status(404).json({ message: 'Not found' });
    res.json({ success: true, registration: reg });
  } catch (err) { next(err); }
};

exports.submitFeedback = async (req, res, next) => {
  try {
    const reg = await AttendeeRegistration.findOne({ _id: req.params.id, attendeeId: req.user._id }).populate('eventId');
    if (!reg) return res.status(404).json({ message: 'Not found' });
    if (!reg.attended) return res.status(400).json({ message: 'Cannot give feedback without attending' });
    if (reg.eventId.status !== 'completed') return res.status(400).json({ message: 'Event not completed yet' });
    
    reg.rating = req.body.rating;
    reg.feedback = req.body.feedback;
    reg.feedbackSubmitted = true;
    await reg.save();
    
    res.json({ success: true, registration: reg });
  } catch (err) { next(err); }
};

exports.getPublicUpdates = async (req, res, next) => {
  try {
    const updates = await LiveUpdate.find({ eventId: req.params.id, isVisibleToAttendees: true }).sort({ createdAt: -1 });
    res.json({ success: true, updates });
  } catch (err) { next(err); }
};
