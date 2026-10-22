const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/assessmentController');

router.use(protect, authorize('candidate'));
router.get('/', controller.listAssessments);
router.get('/attempts', controller.getMyAttempts);
router.get('/verified-skills', controller.getMyVerifiedSkills);
router.get('/:id', controller.getAssessment);
router.post('/:id/attempts', controller.submitAttempt);

module.exports = router;
