const StudentProfile = require('../models/StudentProfile');
const PortalUser = require('../models/PortalUser');
const Student = require('../models/Student');

// ── GET /api/portal/student-profile  (student gets their own data)
exports.getMyProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({ portalUser: req.user._id });
    if (!profile) {
      // Auto-create empty profile on first access
      profile = await StudentProfile.create({ portalUser: req.user._id });
    }
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portal/admin/student-profiles  (admin: list all portal users + their profiles)
exports.listProfiles = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const search = req.query.search ? req.query.search.trim() : '';

    const userFilter = search
      ? { $or: [
          { name:     { $regex: search, $options: 'i' } },
          { username: { $regex: search, $options: 'i' } },
          { email:    { $regex: search, $options: 'i' } },
        ] }
      : {};

    const total = await PortalUser.countDocuments(userFilter);
    const users = await PortalUser.find(userFilter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Attach profile data
    const ids = users.map(u => u._id);
    const profiles = await StudentProfile.find({ portalUser: { $in: ids } }).lean();
    const profileMap = {};
    profiles.forEach(p => { profileMap[p.portalUser.toString()] = p; });

    const data = users.map(u => ({
      ...u,
      profile: profileMap[u._id.toString()] || null,
    }));

    res.json({ success: true, total, page, pages: Math.ceil(total / limit), data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portal/admin/student-profiles/:userId  (admin: get one user's profile)
exports.getProfile = async (req, res) => {
  try {
    const user = await PortalUser.findById(req.params.userId).select('-password').lean();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    let profile = await StudentProfile.findOne({ portalUser: req.params.userId });
    if (!profile) profile = await StudentProfile.create({ portalUser: req.params.userId });

    res.json({ success: true, data: { user, profile } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/portal/admin/student-profiles/:userId  (admin: update student portal data)
exports.updateProfile = async (req, res) => {
  try {
    const allowed = [
      'currentSemesterLabel', 'attendanceSubjects',
      'semesterResults', 'currentSgpa', 'cgpa', 'creditsEarned',
      'timetableCells', 'timeSlots', 'newNoticesCount', 'examStartDate',
    ];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const profile = await StudentProfile.findOneAndUpdate(
      { portalUser: req.params.userId },
      update,
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/portal/admin/portal-users/:userId  (admin: delete portal user + profile)
exports.deletePortalUser = async (req, res) => {
  try {
    await StudentProfile.deleteOne({ portalUser: req.params.userId });
    const user = await PortalUser.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'Portal user deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/portal/admin/portal-users  (admin: create portal user)
exports.createPortalUser = async (req, res) => {
  try {
    const { username, password, name, email, role, prog, sem } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({ success: false, message: 'username, password, name, email required' });
    }
    const exists = await PortalUser.findOne({ username: username.trim() });
    if (exists) return res.status(409).json({ success: false, message: 'Username already exists' });

    const assignedRole = ['student','faculty','admin'].includes(role) ? role : 'student';
    const initials = name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
    const user = await PortalUser.create({
      username: username.trim(), password, role: assignedRole,
      name: name.trim(), email: email.trim().toLowerCase(),
      initials, prog: prog || '', sem: sem || '', authProvider: 'local',
    });
    res.status(201).json({ success: true, data: { ...user.toObject(), password: undefined } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PUT /api/portal/admin/portal-users/:userId  (admin: edit portal user info)
exports.updatePortalUser = async (req, res) => {
  try {
    const allowed = ['name','email','role','prog','sem','initials'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    if (req.body.password) update.password = req.body.password; // will be hashed by pre-save hook

    // Use findById + save to trigger pre-save hook for password hashing
    const user = await PortalUser.findById(req.params.userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    Object.assign(user, update);
    await user.save();

    const out = user.toObject();
    delete out.password;
    res.json({ success: true, data: out });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── GET /api/portal/admin/stats  (admin dashboard live stats)
exports.adminStats = async (req, res) => {
  try {
    const [totalStudents, activeStudents, totalPortalUsers, totalPortalStudents] = await Promise.all([
      Student.countDocuments({}),
      Student.countDocuments({ active: true }),
      PortalUser.countDocuments({}),
      PortalUser.countDocuments({ role: 'student' }),
    ]);
    res.json({
      success: true,
      data: { totalStudents, activeStudents, totalPortalUsers, totalPortalStudents }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
