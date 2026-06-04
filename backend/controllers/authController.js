const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password required' });

    const admin = await Admin.findOne({ email });
    if (!admin || !admin.active) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const match = await admin.matchPassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    res.json({
      success: true,
      token: generateToken(admin._id),
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// PUT /api/auth/password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const admin = await Admin.findById(req.admin._id);
    const match = await admin.matchPassword(currentPassword);
    if (!match) return res.status(400).json({ success: false, message: 'Current password wrong' });
    admin.password = newPassword;
    await admin.save();
    res.json({ success: true, message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
