const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
  eventId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  category:         { type: String, enum: ['venue', 'catering', 'decoration', 'sound_av', 'marketing', 'transportation', 'prizes', 'security', 'miscellaneous'] },
  description:      { type: String },
  estimatedAmount:  { type: Number, default: 0 },
  actualAmount:     { type: Number, default: 0 },
  isPaid:           { type: Boolean, default: false },
  isVerified:       { type: Boolean, default: false },  // Organizer marks as verified
  verifiedAt:       { type: Date },
  notes:            { type: String },
  createdAt:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetItemSchema);
