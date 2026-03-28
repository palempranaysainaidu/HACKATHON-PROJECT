const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  role: { type: String },
  shift: { type: String },
  skills: [String],
  attended: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);
