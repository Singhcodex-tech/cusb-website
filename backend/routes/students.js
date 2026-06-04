const express = require('express');
const router  = express.Router();
const { list, getOne, create, update, remove } = require('../controllers/studentController');
const { protectPortal } = require('../middleware/portalAuth');

// Inline admin-role guard
const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access only' });
  }
  next();
};

router.get('/',       protectPortal, adminOnly, list);
router.get('/:id',    protectPortal, adminOnly, getOne);
router.post('/',      protectPortal, adminOnly, create);
router.put('/:id',    protectPortal, adminOnly, update);
router.delete('/:id', protectPortal, adminOnly, remove);

module.exports = router;
