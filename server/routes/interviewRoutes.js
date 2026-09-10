const express = require('express');
const router = express.Router();
const {
  scheduleInterview,
  getMyInterviews,
  updateInterview
} = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('employer'), scheduleInterview);
router.get('/', protect, getMyInterviews);
router.put('/:id', protect, authorize('employer', 'admin'), updateInterview);

module.exports = router;
