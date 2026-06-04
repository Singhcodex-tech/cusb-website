const express = require('express');
const router = express.Router();
const { login, getMe, firebaseLogin, register } = require('../controllers/portalAuthController');
const { protectPortal } = require('../middleware/portalAuth');

router.post('/register', register);
router.post('/login', login);
router.post('/firebase-login', firebaseLogin);
router.get('/me', protectPortal, getMe);

// One-time seed route — disable after first use by setting SEED_DISABLED=true in env
router.post('/seed-defaults', async (req, res) => {
  if (process.env.SEED_DISABLED === 'true') {
    return res.status(403).json({ success: false, message: 'Seed disabled' });
  }
  const secret = req.headers['x-seed-secret'];
  if (!secret || secret !== process.env.JWT_SECRET) {
    return res.status(403).json({ success: false, message: 'Forbidden' });
  }
  try {
    const PortalUser = require('../models/PortalUser');
    const existing = await PortalUser.countDocuments();
    if (existing > 0) {
      return res.json({ success: true, message: `Already has ${existing} users. No seed needed.` });
    }
    await PortalUser.create([
      { username: 'CUSB26001', password: 'Student@1234', role: 'student', name: 'John Doe', email: 'john.doe@cusb.ac.in', initials: 'JD', prog: 'B.Tech Computer Science', sem: 'Semester IV', authProvider: 'local' },
      { username: 'faculty@cusb.ac.in', password: 'Faculty@1234', role: 'faculty', name: 'Dr. Sarah Connor', email: 'faculty@cusb.ac.in', initials: 'SC', prog: 'School of Technology', sem: 'Professor', authProvider: 'local' },
      { username: 'admin@cusb.ac.in', password: 'Admin@1234', role: 'admin', name: 'CUSB Administrator', email: 'admin@cusb.ac.in', initials: 'CA', prog: 'Administrative Section', sem: 'Administrator', authProvider: 'local' },
    ]);
    res.json({ success: true, message: '3 default users seeded.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
