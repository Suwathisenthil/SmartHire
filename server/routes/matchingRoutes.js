const express = require('express');
const router = express.Router();
const {
  getJobMatchForCandidate,
  getCandidateRankingForJob,
  getJobRecommendations,
  getSkillGapAnalysis
} = require('../controllers/matchingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/job/:jobId', protect, authorize('candidate'), getJobMatchForCandidate);
router.get('/candidates/:jobId', protect, authorize('employer', 'admin'), getCandidateRankingForJob);
router.get('/recommendations', protect, authorize('candidate'), getJobRecommendations);
router.get('/skill-gap', protect, authorize('candidate'), getSkillGapAnalysis);

module.exports = router;
