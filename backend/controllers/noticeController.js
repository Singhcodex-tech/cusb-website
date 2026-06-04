const Notice = require('../models/Notice');

// GET /api/notices — public, with filters
exports.getNotices = async (req, res) => {
  try {
    const { category, limit = 20, page = 1, urgent } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (urgent === 'true') filter.isUrgent = true;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const notices = await Notice.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Notice.countDocuments(filter);
    res.json({ success: true, data: notices, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/notices/:id
exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Not found' });
    notice.views += 1; await notice.save();
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/notices — admin
exports.createNotice = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.admin._id };
    if (req.file) {
      data.pdfUrl = `/uploads/pdfs/${req.file.filename}`;
      data.pdfName = req.file.originalname;
    }
    const notice = await Notice.create(data);
    res.status(201).json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/notices/:id — admin
exports.updateNotice = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.pdfUrl = `/uploads/pdfs/${req.file.filename}`;
      data.pdfName = req.file.originalname;
    }
    const notice = await Notice.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!notice) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: notice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/notices/:id — admin
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
