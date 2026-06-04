const express = require('express');
const router  = express.Router();
const { protectPortal } = require('../middleware/portalAuth');
const {
  getMyProfile,
  listProfiles, getProfile, updateProfile,
  deletePortalUser, createPortalUser, updatePortalUser,
  adminStats,
} = require('../controllers/studentProfileController');

// Admin-only guard
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

// Student: get own profile
router.get('/student-profile', protectPortal, getMyProfile);

// Admin: live stats for dashboard
router.get('/admin/stats', protectPortal, adminOnly, adminStats);

// Admin: portal user management (create, list, edit, delete)
router.get('/admin/portal-users',          protectPortal, adminOnly, listProfiles);
router.post('/admin/portal-users',         protectPortal, adminOnly, createPortalUser);
router.put('/admin/portal-users/:userId',  protectPortal, adminOnly, updatePortalUser);
router.delete('/admin/portal-users/:userId', protectPortal, adminOnly, deletePortalUser);

// Admin: student profile data (attendance, results, timetable)
router.get('/admin/student-profiles/:userId',  protectPortal, adminOnly, getProfile);
router.put('/admin/student-profiles/:userId',  protectPortal, adminOnly, updateProfile);

module.exports = router;
