const Homepage = require('../models/Homepage');

exports.getSection = async (req, res) => {
  try {
    const section = await Homepage.findOne({ section: req.params.section });
    if (!section) return res.status(404).json({ success: false, message: 'Section not found' });
    res.json({ success: true, data: section.data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await Homepage.find({});
    const result = {};
    sections.forEach(s => result[s.section] = s.data);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.upsertSection = async (req, res) => {
  try {
    const section = await Homepage.findOneAndUpdate(
      { section: req.params.section },
      { data: req.body.data, updatedBy: req.admin._id },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
