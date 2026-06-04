const express = require('express');
const router = express.Router();
const { getNotices, getNotice, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getNotices);
router.get('/:id', getNotice);
router.post('/', protect, upload.single('pdf'), createNotice);
router.put('/:id', protect, upload.single('pdf'), updateNotice);
router.delete('/:id', protect, deleteNotice);

module.exports = router;
