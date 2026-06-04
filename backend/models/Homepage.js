const mongoose = require('mongoose');

const HomepageSchema = new mongoose.Schema({
  section: { type: String, required: true, unique: true },
  data:    { type: mongoose.Schema.Types.Mixed, required: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Homepage', HomepageSchema);
