const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title:          { type: String, required: true },
  description:    { type: String },
  date:           { type: Date, required: true },
  endDate:        { type: Date },
  time:           { type: String },
  venue:          { type: String },
  category:       { type: String, enum: ['Academic','Cultural','Sports','Seminar','Workshop','Convocation','Competition','Admissions','Examination','Research','Other'], default: 'Academic' },
  categoryDisplay:{ type: String },         // e.g. "Competition · Law"  (free-text shown on card)
  emoji:          { type: String, default: '📅' },  // card icon
  status:         { type: String, enum: ['Live','Upcoming','Past'], default: 'Upcoming' },
  imageUrl:       { type: String },
  sourceLink:     { type: String },         // "↗ View on CUSB Website" href
  sourceLinkText: { type: String },         // label for source link
  registrationLink: { type: String },
  active:         { type: Boolean, default: true },
  featured:       { type: Boolean, default: false },
  isPast:         { type: Boolean, default: false }, // admin can manually mark past
  createdBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
