const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema({
  eventId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  volunteerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl:      { type: String },   // Cloudinary PDF URL
  skills:         [String],           // ['communication', 'technical', 'logistics', 'management']
  experience:     { type: String },
  motivation:     { type: String },
  availability:   { type: String },   // 'full_day', 'morning', 'evening', 'flexible'
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  volunteerId_card: { type: String }, // Generated ID card URL (Cloudinary PDF)
  assignedRole:     { type: String }, // Role assigned by organizer
  assignedTasks:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  compensation: {
    type: String,
    enum: ['stipend', 'certificate', 'both', 'none'],
    default: 'certificate'
  },
  stipendAmount:  { type: Number, default: 0 },
  appliedAt:      { type: Date, default: Date.now },
  respondedAt:    { type: Date }
});

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
