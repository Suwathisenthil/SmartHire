const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { calculateJobMatch } = require('../services/matchingService');

/**
 * @desc    Apply to a job
 * @route   POST /api/applications
 * @access  Private (Candidate)
 */
exports.applyJob = async (req, res, next) => {
  try {
    const { jobId, coverNote } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid Job ID.'
      });
    }

    const job = await Job.findById(jobId).populate('company');
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'Active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer active.'
      });
    }

    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({
        success: false,
        message: 'The application deadline for this job has passed.'
      });
    }

    // Check duplicate
    const existing = await Application.findOne({
      candidate: req.user._id,
      job: jobId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this position.'
      });
    }

    // Compute live match score snapshot
    const candidate = await User.findById(req.user._id).populate('resume');
    const match = calculateJobMatch(candidate, job);

    const application = await Application.create({
      candidate: req.user._id,
      job: job._id,
      company: job.company._id,
      employer: job.employer,
      resume: candidate.resume?._id,
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
      educationMatch: match.educationMatch,
      status: 'Applied',
      statusHistory: [{
        status: 'Applied',
        date: new Date(),
        notes: 'Application submitted by candidate',
        updatedBy: req.user._id
      }],
      coverNote: coverNote || ''
    });

    // Update applicant count on job
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantsCount: 1 } });

    // Send notification to Employer
    await Notification.create({
      recipient: job.employer,
      sender: req.user._id,
      type: 'application',
      title: 'New Candidate Application',
      message: `${req.user.name} applied for "${job.title}" with a match score of ${match.score}%.`,
      link: `/employer/jobs/${job._id}/applicants`,
      relatedEntity: { entityType: 'Application', entityId: application._id }
    });

    // Send confirmation to Candidate
    await Notification.create({
      recipient: req.user._id,
      type: 'application',
      title: 'Application Submitted',
      message: `You successfully applied for "${job.title}" at ${job.company.name}.`,
      link: '/candidate/applications',
      relatedEntity: { entityType: 'Application', entityId: application._id }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current candidate's applications
 * @route   GET /api/applications/my
 * @access  Private (Candidate)
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        populate: { path: 'company', select: 'name logo location industry' }
      })
      .populate('company', 'name logo location industry')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get applications for a job (Employer)
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Employer, Admin)
 */
exports.getJobApplications = async (req, res, next) => {
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
        message: 'Not authorized'
      });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate('candidate', 'name email phone location headline skills totalExperienceYears education certifications')
      .populate('resume')
      .sort({ matchScore: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Employer, Admin)
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const application = await Application.findById(req.params.id)
      .populate('job', 'title')
      .populate('company', 'name');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    application.status = status;
    application.statusHistory.push({
      status,
      date: new Date(),
      notes: notes || `Status updated to ${status}`,
      updatedBy: req.user._id
    });

    await application.save();

    // Create candidate notification
    await Notification.create({
      recipient: application.candidate,
      sender: req.user._id,
      type: 'status_change',
      title: `Application Status: ${status}`,
      message: `Your application for "${application.job?.title}" at ${application.company?.name} has been updated to: ${status}.`,
      link: '/candidate/applications',
      relatedEntity: { entityType: 'Application', entityId: application._id }
    });

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Withdraw application
 * @route   PUT /api/applications/:id/withdraw
 * @access  Private (Candidate)
 */
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    if (application.candidate.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (application.status === 'Selected' || application.status === 'Rejected') {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw an application that is already ${application.status}.`
      });
    }

    application.status = 'Withdrawn';
    application.statusHistory.push({
      status: 'Withdrawn',
      date: new Date(),
      notes: 'Withdrawn by candidate',
      updatedBy: req.user._id
    });

    await application.save();

    // Decrement applicant count
    await Job.findByIdAndUpdate(application.job, { $inc: { applicantsCount: -1 } });

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      data: { application }
    });
  } catch (error) {
    next(error);
  }
};
