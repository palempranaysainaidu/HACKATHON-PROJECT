const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  eventId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:        { type: String, required: true },
  message:      { type: String, required: true },
  targetRoles:  [{ type: String, enum: ['volunteer', 'attendee', 'all'] }],
  isPinned:     { type: Boolean, default: false },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', announcementSchema);
