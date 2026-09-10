const express = require('express');
const router = express.Router();
const {
  uploadResume,
  getMyResume,
  updateExtractedSkills,
  deleteResume
} = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, authorize('candidate'), upload.single('resume'), uploadResume);
router.get('/my', protect, authorize('candidate'), getMyResume);
router.put('/skills', protect, authorize('candidate'), updateExtractedSkills);
router.delete('/my', protect, authorize('candidate'), deleteResume);

module.exports = router;
