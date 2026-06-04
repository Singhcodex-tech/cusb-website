const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title:     { type: String, required: true },
  imageUrl:  { type: String, required: true },
  category:  { type: String, enum: ['Campus','Events','Sports','Cultural','Academic','Infrastructure'], default: 'Campus' },
  caption:   { type: String },
  order:     { type: Number, default: 0 },
  active:    { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
