const mongoose = require('mongoose');

const liveUpdateSchema = new mongoose.Schema({
  eventId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  postedBy:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message:      { type: String, required: true },
  category:     { type: String, enum: ['queue', 'food', 'technical', 'security', 'general', 'emergency'] },
  severity:     { type: String, enum: ['info', 'warning', 'critical'], default: 'info' },
  isVisibleToAttendees: { type: Boolean, default: false },
  resolvedAt:   { type: Date },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('LiveUpdate', liveUpdateSchema);
