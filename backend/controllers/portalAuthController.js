const jwt = require('jsonwebtoken');
const PortalUser = require('../models/PortalUser');
const admin = require('../config/firebaseAdmin');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/portal/register
exports.register = async (req, res) => {
  try {
    const { username, password, name, email, role, prog, sem } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({ success: false, message: 'username, password, name and email are required' });
    }
    const existing = await PortalUser.findOne({ username: username.trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Enrollment ID already registered' });
    }
    const assignedRole = ['student','faculty','admin'].includes(role) ? role : 'student';
    const initials = name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
    const user = await PortalUser.create({
      username: username.trim(),
      password,
      role: assignedRole,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      initials,
      prog: prog || (assignedRole === 'faculty' ? 'School · CUSB' : 'CUSB Student Portal'),
      sem: sem || (assignedRole === 'faculty' ? 'Faculty' : 'Student'),
      authProvider: 'local',
    });
    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, name: user.name, email: user.email, role: user.role, initials: user.initials, prog: user.prog, sem: user.sem }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/login
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Enrollment ID and password are required' });
    }

    // Find by username only (no role filter) — support enrollment ID or email
    const trimmedUsername = username.trim();
    let user = await PortalUser.findOne({ username: trimmedUsername });
    // Also try matching by email in case user typed email
    if (!user) user = await PortalUser.findOne({ email: trimmedUsername.toLowerCase() });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Enrollment ID not found. Please register first or check your ID.' });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        initials: user.initials || user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(),
        prog: user.prog,
        sem: user.sem
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/portal/me
exports.getMe = async (req, res) => {
  try {
    const user = await PortalUser.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/portal/firebase-login
// Body: { idToken, role }  — role is optional hint; defaults to 'student'
exports.firebaseLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;
    if (!idToken) return res.status(400).json({ success: false, message: 'idToken required' });

    // Verify Firebase ID token
    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (e) {
      return res.status(401).json({ success: false, message: 'Invalid Firebase token' });
    }

    const { uid, email, name, picture } = decoded;
    const assignedRole = ['student','faculty','admin'].includes(role) ? role : 'student';

    // Upsert: find by firebaseUid or email, update or create
    let user = await PortalUser.findOne({ firebaseUid: uid });
    if (!user && email) user = await PortalUser.findOne({ email: email.toLowerCase() });

    if (user) {
      // Sync latest Firebase profile info
      if (!user.firebaseUid) user.firebaseUid = uid;
      if (picture && !user.photoURL) user.photoURL = picture;
      user.authProvider = 'google';
      await user.save();
    } else {
      // Auto-register new Google user as student (or provided role)
      const baseName = name || email.split('@')[0];
      const initials = baseName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
      user = await PortalUser.create({
        username:     uid,           // use firebase UID as username
        password:     uid + process.env.JWT_SECRET, // hashed, never used for local login
        role:         assignedRole,
        name:         baseName,
        email:        email.toLowerCase(),
        initials,
        prog:         assignedRole === 'faculty' ? 'School · CUSB' : 'CUSB Student Portal',
        sem:          assignedRole === 'faculty' ? 'Faculty' : 'Student',
        firebaseUid:  uid,
        photoURL:     picture || '',
        authProvider: 'google',
      });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id:       user._id,
        username: user.username,
        name:     user.name,
        email:    user.email,
        role:     user.role,
        initials: user.initials,
        prog:     user.prog,
        sem:      user.sem,
        photoURL: user.photoURL || '',
      }
    });
  } catch (err) {
    console.error('firebaseLogin error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
