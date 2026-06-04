const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
  name:           { type: String, required: true },
  designation:    { type: String, required: true },
  department:     { type: String, required: true },
  school:         { type: String, required: true },
  email:          { type: String },
  phone:          { type: String },
  specialization: { type: String },
  qualification:  { type: String },
  imageUrl:       { type: String },
  profileUrl:     { type: String },
  experience:     { type: String },
  publications:   { type: Number, default: 0 },
  order:          { type: Number, default: 0 },
  active:         { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Faculty', FacultySchema);
