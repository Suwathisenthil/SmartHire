const LearningProgress = require('../models/LearningProgress');
const VerifiedSkill = require('../models/VerifiedSkill');
const User = require('../models/User');
const Job = require('../models/Job');
const { analyzeSkillGap } = require('../services/matchingService');
const { syncRoadmap } = require('../services/learningService');

exports.getRoadmap = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.user._id).populate('resume');
    const activeJobs = await Job.find({ status: 'Active' });
    const gap = analyzeSkillGap(candidate, activeJobs);
    const roadmap = await syncRoadmap(req.user._id, gap.recommendedSkillsToLearn);
    const verifiedSkills = await VerifiedSkill.find({ candidate: req.user._id }).sort({ score: -1 });

    res.json({
      success: true,
      data: {
        roadmap,
        verifiedSkills,
        totalJobsAnalyzed: activeJobs.length,
        missingSkillsCount: gap.missingSkillsCount
      }
    });
  } catch (error) { next(error); }
};

exports.updateProgress = async (req, res, next) => {
  try {
    const percent = Math.min(100, Math.max(0, Number(req.body.progressPercent)));
    if (!Number.isFinite(percent)) return res.status(400).json({ success: false, message: 'Progress must be a number from 0 to 100.' });

    const status = percent >= 100 ? 'Completed' : percent > 0 ? 'In Progress' : 'Not Started';
    const progress = await LearningProgress.findOneAndUpdate(
      { _id: req.params.id, candidate: req.user._id },
      { $set: { progressPercent: Math.round(percent), status, lastActivityAt: new Date() } },
      { new: true }
    );
    if (!progress) return res.status(404).json({ success: false, message: 'Roadmap item not found.' });
    res.json({ success: true, message: 'Learning progress updated.', data: { progress } });
  } catch (error) { next(error); }
};
