const Gallery = require('../models/Gallery');

exports.getGallery = async (req, res) => {
  try {
    const { category, limit = 50 } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    const images = await Gallery.find(filter).sort({ order: 1, createdAt: -1 }).limit(parseInt(limit));
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createGalleryItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image required' });
    const data = { ...req.body, imageUrl: `/uploads/images/${req.file.filename}`, createdBy: req.admin._id };
    const item = await Gallery.create(data);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateGalleryItem = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
    const item = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: item });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
