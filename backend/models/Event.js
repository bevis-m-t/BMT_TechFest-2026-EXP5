const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  fee: { type: Number, required: true, default: 0 },
  seats: { type: Number, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);