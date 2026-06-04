const mongoose = require('mongoose');

// Per-subject attendance record
const AttendanceSubjectSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  attended: { type: Number, default: 0 },
  total:    { type: Number, default: 0 },
}, { _id: false });

// Per-subject result record
const ResultSubjectSchema = new mongoose.Schema({
  courseCode: { type: String },
  subject:    { type: String, required: true },
  internal:   { type: Number, default: 0 },
  internalMax:{ type: Number, default: 25 },
  external:   { type: Number, default: 0 },
  externalMax:{ type: Number, default: 75 },
  grade:      { type: String },
  points:     { type: Number },
}, { _id: false });

// Semester result
const SemesterResultSchema = new mongoose.Schema({
  semesterLabel: { type: String },   // e.g. "Semester III"
  sgpa:          { type: Number },
  credits:       { type: Number },
  subjects:      [ResultSubjectSchema],
}, { _id: false });

// Timetable cell: day index (0=Mon..5=Sat) × slot index
const TimetableCellSchema = new mongoose.Schema({
  day:       { type: Number, min: 0, max: 5 },  // 0=Mon
  slotIndex: { type: Number, min: 0, max: 4 },  // 0-4 time slots
  subject:   { type: String },                   // short label
  colorKey:  { type: String },                   // c1..c6
}, { _id: false });

const StudentProfileSchema = new mongoose.Schema({
  portalUser: { type: mongoose.Schema.Types.ObjectId, ref: 'PortalUser', required: true, unique: true },

  // Attendance
  currentSemesterLabel: { type: String, default: 'Semester IV' },
  attendanceSubjects:   [AttendanceSubjectSchema],

  // Results
  semesterResults: [SemesterResultSchema],   // past semesters
  currentSgpa:     { type: Number },
  cgpa:            { type: Number },
  creditsEarned:   { type: Number, default: 0 },

  // Timetable
  timetableCells: [TimetableCellSchema],
  timeSlots: { type: [String], default: ['9–10 AM','10–11 AM','11–12 PM','2–3 PM','3–4 PM'] },

  // Notices count (admin can push)
  newNoticesCount: { type: Number, default: 0 },

  // Days to exams
  examStartDate: { type: Date },

}, { timestamps: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
