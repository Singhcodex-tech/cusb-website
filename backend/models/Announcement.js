const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  text:      { type: String, required: true },
  link:      { type: String },
  active:    { type: Boolean, default: true },
  order:     { type: Number, default: 0 },
  expiresAt: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
