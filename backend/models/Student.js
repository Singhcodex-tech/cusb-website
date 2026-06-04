const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  enrollmentId:   { type: String, required: true, unique: true, trim: true },
  name:           { type: String, required: true, trim: true },
  email:          { type: String, required: true, trim: true, lowercase: true },
  phone:          { type: String, trim: true },
  gender:         { type: String, enum: ['Male', 'Female', 'Other'] },
  dob:            { type: Date },
  category:       { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Other'], default: 'General' },
  program:        { type: String, required: true },          // e.g. B.Tech Computer Science
  school:         { type: String, required: true },          // e.g. School of Technology
  semester:       { type: Number, required: true, min: 1, max: 12 },
  academicYear:   { type: String },                          // e.g. 2024-25
  admissionYear:  { type: Number },
  address:        { type: String },
  guardianName:   { type: String },
  guardianPhone:  { type: String },
  active:         { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
