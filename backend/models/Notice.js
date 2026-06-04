const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  category:   { type: String, enum: ['Academic','Admission','Examination','General','Research','Administrative'], default: 'General' },
  date:       { type: Date, default: Date.now },
  content:    { type: String },
  pdfUrl:     { type: String },
  pdfName:    { type: String },
  isUrgent:   { type: Boolean, default: false },
  active:     { type: Boolean, default: true },
  views:      { type: Number, default: 0 },
  createdBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Notice', NoticeSchema);
