const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/learningController');

router.use(protect, authorize('candidate'));
router.get('/roadmap', controller.getRoadmap);
router.patch('/roadmap/:id', controller.updateProgress);

module.exports = router;
