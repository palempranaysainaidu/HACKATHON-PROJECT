const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  eventId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  title:          { type: String, required: true },
  description:    { type: String },
  category:       { type: String, enum: ['logistics', 'marketing', 'permissions', 'volunteers', 'finance', 'technical', 'general'] },
  assignedTo:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Volunteer user ID
  assignedRole:   { type: String },   // Role label, e.g. "Stage Manager"
  priority:       { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  status:         { type: String, enum: ['pending', 'in_progress', 'completed', 'overdue'], default: 'pending' },
  dueDate:        { type: Date },
  createdBy:      { type: String, enum: ['ai', 'organizer'], default: 'ai' },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
