const express = require('express');
const router = express.Router();
const { getSection, getAllSections, upsertSection } = require('../controllers/homepageController');
const { protect } = require('../middleware/auth');

router.get('/', getAllSections);
router.get('/:section', getSection);
router.put('/:section', protect, upsertSection);

module.exports = router;
