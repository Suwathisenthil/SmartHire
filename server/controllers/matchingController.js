const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');
const { calculateJobMatch, analyzeSkillGap } = require('../services/matchingService');

/**
 * @desc    Get instant match score for current candidate against a specific job
 * @route   GET /api/matching/job/:jobId
 * @access  Private (Candidate)
 */
exports.getJobMatchForCandidate = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('company');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const candidate = await User.findById(req.user._id).populate('resume');
    const matchDetails = calculateJobMatch(candidate, job);

    res.status(200).json({
      success: true,
      data: {
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.company?.name,
        ...matchDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get candidate ranking for a job (ranked applicants)
 * @route   GET /api/matching/candidates/:jobId
 * @access  Private (Employer, Admin)
 */
exports.getCandidateRankingForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view candidate ranking for this job'
      });
    }

    const { minScore = 0, status } = req.query;

    // Fetch applications for this job
    const appQuery = { job: job._id };
    if (status) {
      appQuery.status = status;
    }

    const applications = await Application.find(appQuery)
      .populate({
        path: 'candidate',
        select: 'name email phone location headline skills totalExperienceYears education certifications resume',
        populate: { path: 'resume' }
      })
      .populate('resume');

    // Recompute match score dynamically to ensure fresh consistency with latest profile updates
    const rankedApplicants = applications.map(app => {
      const match = calculateJobMatch(app.candidate, job);
      return {
        applicationId: app._id,
        status: app.status,
        appliedDate: app.createdAt,
        candidate: app.candidate,
        resume: app.resume,
        matchScore: match.score,
        scoreBreakdown: {
          skillScore: match.skillScore,
          experienceScore: match.experienceScore,
          educationScore: match.educationScore,
          certificationScore: match.certificationScore
        },
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        preferredSkillsMatched: match.preferredSkillsMatched,
        experienceMatch: match.experienceMatch,
        educationMatch: match.educationMatch
      };
    });

    // Filter by minScore and sort descending by score, then appliedDate
    const filtered = rankedApplicants
      .filter(item => item.matchScore >= Number(minScore))
      .sort((a, b) => b.matchScore - a.matchScore || new Date(b.appliedDate) - new Date(a.appliedDate));

    res.status(200).json({
      success: true,
      data: {
        jobTitle: job.title,
        totalApplicants: filtered.length,
        applicants: filtered
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get job recommendations for current candidate ranked by match score
 * @route   GET /api/matching/recommendations
 * @access  Private (Candidate)
 */
exports.getJobRecommendations = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.user._id).populate('resume');

    // Fetch active and non-expired jobs
    const currentDate = new Date();
    const activeJobs = await Job.find({
      status: 'Active',
      deadline: { $gte: currentDate }
    }).populate('company', 'name logo location industry');

    // Check jobs already applied to by candidate
    const existingApplications = await Application.find({ candidate: req.user._id }).select('job');
    const appliedJobIds = new Set(existingApplications.map(a => a.job.toString()));

    // Calculate match score for every open job
    const recommendations = activeJobs.map(job => {
      const match = calculateJobMatch(candidate, job);
      return {
        job,
        matchScore: match.score,
        skillScore: match.skillScore,
        experienceScore: match.experienceScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        isApplied: appliedJobIds.has(job._id.toString())
      };
    });

    // Sort descending by matchScore
    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      success: true,
      data: {
        total: recommendations.length,
        recommendations: recommendations.slice(0, 20) // Top 20 best matches
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get aggregated skill gap analysis for current candidate
 * @route   GET /api/matching/skill-gap
 * @access  Private (Candidate)
 */
exports.getSkillGapAnalysis = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.user._id).populate('resume');
    const activeJobs = await Job.find({ status: 'Active' });

    const gapReport = analyzeSkillGap(candidate, activeJobs);

    res.status(200).json({
      success: true,
      data: {
        ...gapReport,
        totalJobsAnalyzed: activeJobs.length
      }
    });
  } catch (error) {
    next(error);
  }
};
