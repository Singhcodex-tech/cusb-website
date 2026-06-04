const mongoose = require('mongoose');

const QuickAccessSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  link:   { type: String, required: true },
  icon:   { type: String },
  active: { type: Boolean, default: true },
  order:  { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('QuickAccess', QuickAccessSchema);
