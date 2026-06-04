const Student = require('../models/Student');

// GET /api/students?page=1&limit=20&search=xxx
exports.list = async (req, res) => {
  try {
    const page   = parseInt(req.query.page)  || 1;
    const limit  = parseInt(req.query.limit) || 20;
    const search = req.query.search ? req.query.search.trim() : '';
    const filter = search
      ? { $or: [
          { name:         { $regex: search, $options: 'i' } },
          { enrollmentId: { $regex: search, $options: 'i' } },
          { email:        { $regex: search, $options: 'i' } },
          { program:      { $regex: search, $options: 'i' } },
        ] }
      : {};
    const total    = await Student.countDocuments(filter);
    const students = await Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.json({ success: true, total, page, pages: Math.ceil(total / limit), data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/students/:id
exports.getOne = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).lean();
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/students
exports.create = async (req, res) => {
  try {
    const { enrollmentId, name, email, phone, gender, dob, category,
            program, school, semester, academicYear, admissionYear,
            address, guardianName, guardianPhone } = req.body;
    if (!enrollmentId || !name || !email || !program || !school || !semester) {
      return res.status(400).json({ success: false, message: 'enrollmentId, name, email, program, school, semester are required' });
    }
    const exists = await Student.findOne({ enrollmentId: enrollmentId.trim() });
    if (exists) return res.status(409).json({ success: false, message: 'Enrollment ID already exists' });

    const student = await Student.create({
      enrollmentId: enrollmentId.trim(),
      name: name.trim(), email, phone, gender, dob, category,
      program: program.trim(), school: school.trim(), semester,
      academicYear, admissionYear, address, guardianName, guardianPhone,
    });
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/students/:id
exports.update = async (req, res) => {
  try {
    const allowed = ['name','email','phone','gender','dob','category','program','school',
                     'semester','academicYear','admissionYear','address','guardianName','guardianPhone','active'];
    const update = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });

    const student = await Student.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/students/:id
exports.remove = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
