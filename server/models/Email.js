const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['permission', 'sponsorship', 'volunteer_recruitment', 'attendee_confirmation', 'general'],
    required: true
  },
  subject: { type: String, required: true },
  body: { type: String, required: true },
  recipientEmail: { type: String },
  recipientName: { type: String },
  status: {
    type: String,
    enum: ['draft', 'sent', 'failed'],
    default: 'draft'
  },
  sentAt: { type: Date },
  generatedByAI: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Email', emailSchema);
