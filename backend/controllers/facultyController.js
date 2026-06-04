const Faculty = require('../models/Faculty');

exports.getFaculty = async (req, res) => {
  try {
    const { school, department, search } = req.query;
    const filter = { active: true };
    if (school) filter.school = school;
    if (department) filter.department = department;
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { specialization: new RegExp(search, 'i') },
      { department: new RegExp(search, 'i') }
    ];
    const faculty = await Faculty.find(filter).sort({ school: 1, department: 1, order: 1, name: 1 });
    res.json({ success: true, data: faculty, total: faculty.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getFacultyById = async (req, res) => {
  try {
    const f = await Faculty.findById(req.params.id);
    if (!f) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: f });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createFaculty = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
    const f = await Faculty.create(data);
    res.status(201).json({ success: true, data: f });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateFaculty = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
    const f = await Faculty.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!f) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: f });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteFaculty = async (req, res) => {
  try {
    const f = await Faculty.findByIdAndDelete(req.params.id);
    if (!f) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
