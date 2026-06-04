const express = require('express');
const router = express.Router();
const { getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', getGallery);
router.post('/', protect, upload.single('image'), createGalleryItem);
router.put('/:id', protect, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

module.exports = router;
