const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  title: { type: String, required: true, trim: true },
  description: { type: String },
  category: {
    type: String,
    enum: ['logistics', 'marketing', 'permissions', 'volunteers', 'finance', 'technical', 'general'],
    default: 'general'
  },
  assignee: { type: String },
  dueDate: { type: Date },
  priority: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'overdue'],
    default: 'pending'
  },
  timelineLabel: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
