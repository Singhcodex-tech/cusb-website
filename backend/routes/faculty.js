const express = require('express');
const router = express.Router();
const { getFaculty, getFacultyById, createFaculty, updateFaculty, deleteFaculty } = require('../controllers/facultyController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getFaculty);
router.get('/:id', getFacultyById);
router.post('/', protect, upload.single('image'), createFaculty);
router.put('/:id', protect, upload.single('image'), updateFaculty);
router.delete('/:id', protect, deleteFaculty);

module.exports = router;
