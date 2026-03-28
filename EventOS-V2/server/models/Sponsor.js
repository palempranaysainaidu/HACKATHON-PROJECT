const mongoose = require('mongoose');

const sponsorSchema = new mongoose.Schema({
  eventId:        { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  companyName:    { type: String, required: true },
  contactPerson:  { type: String },
  contactEmail:   { type: String },
  amount:         { type: Number, required: true },
  tier:           { type: String, enum: ['title', 'co', 'associate', 'in_kind'] },
  logo:           { type: String },  // Cloudinary URL
  status:         { type: String, enum: ['proposed', 'confirmed', 'received'], default: 'proposed' },
  receivedAt:     { type: Date },
  notes:          { type: String },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sponsor', sponsorSchema);
