const express = require('express');
const router = express.Router();
const {
  getProfile,
  getCandidateById,
  updateProfile,
  addExperience,
  deleteExperience,
  addEducation,
  deleteEducation,
  addCertification,
  deleteCertification,
  uploadProfilePhoto
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/photo', protect, authorize('candidate'), require('../middleware/profileUpload').single('photo'), uploadProfilePhoto);
router.get('/candidate/:id', protect, authorize('employer', 'admin'), getCandidateById);

// Experience
router.post('/experience', protect, authorize('candidate'), addExperience);
router.delete('/experience/:expId', protect, authorize('candidate'), deleteExperience);

// Education
router.post('/education', protect, authorize('candidate'), addEducation);
router.delete('/education/:eduId', protect, authorize('candidate'), deleteEducation);

// Certifications
router.post('/certifications', protect, authorize('candidate'), addCertification);
router.delete('/certifications/:certId', protect, authorize('candidate'), deleteCertification);

module.exports = router;
