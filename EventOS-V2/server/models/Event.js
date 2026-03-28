const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organizerId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:             { type: String, required: true },
  type:             { type: String, enum: ['cultural', 'technical', 'sports', 'academic', 'social', 'fundraiser', 'other'] },
  description:      { type: String },
  date:             { type: Date, required: true },
  endDate:          { type: Date },
  location:         { type: String },
  city:             { type: String },
  venueDetails:     { type: String },
  expectedAudience: { type: Number, required: true },
  theme:            { type: String },
  slug:             { type: String, unique: true },
  coverImage:       { type: String },  // Cloudinary URL
  ticketPrice:      { type: Number, default: 0 },
  isFree:           { type: Boolean, default: true },
  platformFee:      { type: Number, default: 0 },
  platformFeePaid:  { type: Boolean, default: false },
  totalBudget:      { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['draft', 'open', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  },
  providesFood:          { type: Boolean, default: false },
  foodDetails:           { type: String },
  foodCost:              { type: Number, default: 0 },
  providesTransport:     { type: Boolean, default: false },
  transportDetails:      { type: String },
  transportCost:         { type: Number, default: 0 },
  volunteersNeeded:      { type: Number, default: 0 },
  minVolunteersForTaskDivision: { type: Number, default: 1 },
  requiredSkills:        [{ type: String }],
  maxAttendees:          { type: Number },
  planGenerated:         { type: Boolean, default: false },
  securityRisks:         [{ risk: String, severity: String, mitigation: String }],
  announcements:         [{ message: String, targetRole: String, createdAt: Date }],
  createdAt:             { type: Date, default: Date.now },
  updatedAt:             { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
