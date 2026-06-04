const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const PortalUserSchema = new mongoose.Schema({
  username:    { type: String, required: true, unique: true },
  password:    { type: String, required: true },
  role:        { type: String, enum: ['student', 'faculty', 'admin'], required: true },
  name:        { type: String, required: true },
  email:       { type: String, required: true },
  initials:    { type: String },
  prog:        { type: String },
  sem:         { type: String },
  firebaseUid: { type: String, unique: true, sparse: true },
  photoURL:    { type: String },
  authProvider:{ type: String, enum: ['local', 'google'], default: 'local' },
}, { timestamps: true });

// Hash password before saving
PortalUserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
PortalUserSchema.methods.matchPassword = async function(entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('PortalUser', PortalUserSchema);
