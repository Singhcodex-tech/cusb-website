const Contact = require('../models/Contact');

exports.getContact = async (req, res) => {
  try {
    const sections = await Contact.find({});
    const result = {};
    sections.forEach(s => result[s.section] = s.data);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateContact = async (req, res) => {
  try {
    const section = await Contact.findOneAndUpdate(
      { section: req.params.section },
      { data: req.body.data, updatedBy: req.admin._id },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: section });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
