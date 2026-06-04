const express = require('express');
const router = express.Router();
const { getQuickAccess, createQuickAccess, updateQuickAccess, deleteQuickAccess } = require('../controllers/quickAccessController');
const { protect } = require('../middleware/auth');

router.get('/', getQuickAccess);
router.post('/', protect, createQuickAccess);
router.put('/:id', protect, updateQuickAccess);
router.delete('/:id', protect, deleteQuickAccess);

module.exports = router;
