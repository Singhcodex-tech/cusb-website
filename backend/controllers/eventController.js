const Event = require('../models/Event');

exports.getEvents = async (req, res) => {
  try {
    const { category, upcoming, past, featured, limit = 20, page = 1 } = req.query;
    const filter = { active: true };
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;

    let sortDir = -1;

    if (past === 'true') {
      // Past: isPast flag OR date already passed
      filter.$or = [{ isPast: true }, { date: { $lt: new Date() } }];
      sortDir = -1;
    } else if (upcoming === 'true') {
      // Live/Upcoming: not isPast AND date in future (or status Live)
      filter.isPast = { $ne: true };
      filter.$or = [{ date: { $gte: new Date() } }, { status: 'Live' }];
      sortDir = 1;
    } else {
      // default: all active
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const events = await Event.find(filter).sort({ date: sortDir }).skip(skip).limit(parseInt(limit));
    const total = await Event.countDocuments(filter);
    res.json({ success: true, data: events, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.admin._id };
    if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
    const event = await Event.create(data);
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.imageUrl = `/uploads/images/${req.file.filename}`;
    const event = await Event.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
