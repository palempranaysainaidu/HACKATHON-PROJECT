const mongoose = require('mongoose');

const venueSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  city:           { type: String, required: true },
  address:        { type: String },
  capacity:       { type: Number },
  type:           { type: String, enum: ['auditorium', 'open_ground', 'hall', 'stadium', 'community_center', 'hotel_banquet', 'other'] },
  amenities:      [String],
  pricePerDay:    { type: Number },
  contactPhone:   { type: String },
  contactEmail:   { type: String },
  reviewScore:    { type: Number, default: 0 },
  reviewCount:    { type: Number, default: 0 },
  reviews:        [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String, date: Date }],
  photos:         [String],
  addedAt:        { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venue', venueSchema);
