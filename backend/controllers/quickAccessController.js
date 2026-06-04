const QuickAccess = require('../models/QuickAccess');

// Get all active quick access items
exports.getQuickAccess = async (req, res) => {
  try {
    const items = await QuickAccess.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Create a quick access item
exports.createQuickAccess = async (req, res) => {
  try {
    const item = await QuickAccess.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a quick access item
exports.updateQuickAccess = async (req, res) => {
  try {
    const item = await QuickAccess.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete a quick access item
exports.deleteQuickAccess = async (req, res) => {
  try {
    await QuickAccess.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
