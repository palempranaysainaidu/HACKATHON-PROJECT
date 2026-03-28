const mongoose = require('mongoose');

const attendeeRegistrationSchema = new mongoose.Schema({
  eventId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  attendeeId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  registrationCode: { type: String, unique: true },  // 8-char code
  idCardUrl:        { type: String },  // Generated PDF ID card (Cloudinary)
  wantsFood:        { type: Boolean, default: false },
  wantsTransport:   { type: Boolean, default: false },
  numberOfGuests:   { type: Number, default: 1 },
  totalCost:        { type: Number, default: 0 },
  paymentStatus:    { type: String, enum: ['pending', 'paid', 'free'], default: 'free' },
  attended:         { type: Boolean, default: false },
  markedPresentBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Volunteer
  markedPresentAt:  { type: Date },
  feedback:         { type: String },
  rating:           { type: Number, min: 1, max: 5 },
  feedbackSubmitted:{ type: Boolean, default: false },
  registeredAt:     { type: Date, default: Date.now }
});

module.exports = mongoose.model('AttendeeRegistration', attendeeRegistrationSchema);
