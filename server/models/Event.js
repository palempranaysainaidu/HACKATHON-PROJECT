const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['cultural', 'technical', 'sports', 'academic', 'social', 'fundraiser', 'other'],
    default: 'other'
  },
  date: { type: Date },
  location: { type: String, trim: true },
  city: { type: String, trim: true },
  audience: { type: Number, default: 100 },
  budget: { type: Number, default: 0 },
  theme: { type: String, trim: true },
  description: { type: String },
  slug: { type: String, unique: true },
  status: {
    type: String,
    enum: ['draft', 'planned', 'active', 'completed'],
    default: 'draft'
  },
  timeline: [
    {
      label: String,
      date: Date,
      description: String
    }
  ],
  planGenerated: { type: Boolean, default: false },
  websiteTheme: {
    type: String,
    enum: ['classic', 'modern'],
    default: 'modern'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

eventSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Event', eventSchema);
