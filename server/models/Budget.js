const mongoose = require('mongoose');

const budgetItemSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['venue', 'catering', 'decoration', 'sound_av', 'marketing', 'transportation', 'prizes', 'miscellaneous'],
    required: true
  },
  description: { type: String },
  estimatedAmount: { type: Number, default: 0 },
  actualAmount: { type: Number, default: 0 },
  isPaid: { type: Boolean, default: false },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Budget', budgetItemSchema);
