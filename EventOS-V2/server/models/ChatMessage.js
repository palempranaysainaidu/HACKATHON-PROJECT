const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  eventId:      { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  senderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName:   { type: String },
  message:      { type: String, required: true },
  taskGroup:    { type: String },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
