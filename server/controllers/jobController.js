const Job = require('../models/Job');
const Company = require('../models/Company');
const { normalizeSkillList, calculateJobMatch } = require('../services/matchingService');

/**
 * @desc    Get all jobs with search, filtering, and pagination
 * @route   GET /api/jobs
 * @access  Public
 */
exports.getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      workMode,
      jobType,
      experience,
      skills,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc'
    } = req.query;

    const query = {};

    // Only active jobs for public
    if (status) {
      query.status = status;
    } else {
      query.status = 'Active';
    }

    // Keyword search across title, description, and location
    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { location: { $regex: keyword, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (workMode) {
      query.workMode = workMode;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience !== undefined && experience !== '') {
      query.requiredExperience = { $lte: Number(experience) };
    }

    if (skills) {
      const skillArray = skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillArray.length > 0) {
        query.requiredSkills = { $in: skillArray.map(s => new RegExp(`^${s}$`, 'i')) };
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('company', 'name logo location industry status')
      .populate('employer', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: {
        jobs,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
exports.getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company')
      .populate('employer', 'name email');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new job posting
 * @route   POST /api/jobs
 * @access  Private (Employer)
 */
exports.createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      requiredSkills,
      preferredSkills,
      requiredExperience,
      education,
      location,
      workMode,
      jobType,
      salary,
      deadline
    } = req.body;

    if (!title || !description || !requiredSkills || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide job title, description, required skills, and location.'
      });
    }

    let company = await Company.findOne({ employer: req.user._id });
    if (!company) {
      // Auto-create default company if employer hasn't made one
      company = await Company.create({
        employer: req.user._id,
        name: `${req.user.name}'s Organization`,
        industry: 'Technology',
        location: location || 'Bangalore, India',
        status: 'Approved'
      });
    }

    const job = await Job.create({
      company: company._id,
      employer: req.user._id,
      title,
      description,
      requiredSkills: normalizeSkillList(Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',')),
      preferredSkills: normalizeSkillList(Array.isArray(preferredSkills) ? preferredSkills : (preferredSkills ? preferredSkills.split(',') : [])),
      requiredExperience: Number(requiredExperience) || 0,
      education: education || "Bachelor's Degree in CS, IT or equivalent",
      location,
      workMode: workMode || 'Remote',
      jobType: jobType || 'Full Time',
      salary: salary || { min: 0, max: 0, currency: 'INR', period: 'per year' },
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    const populatedJob = await Job.findById(job._id).populate('company');

    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      data: { job: populatedJob }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a job posting
 * @route   PUT /api/jobs/:id
 * @access  Private (Employer, Admin)
 */
exports.updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    const updates = { ...req.body };
    if (updates.requiredSkills) {
      updates.requiredSkills = normalizeSkillList(Array.isArray(updates.requiredSkills) ? updates.requiredSkills : updates.requiredSkills.split(','));
    }
    if (updates.preferredSkills) {
      updates.preferredSkills = normalizeSkillList(Array.isArray(updates.preferredSkills) ? updates.preferredSkills : updates.preferredSkills.split(','));
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('company');

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: { job: updatedJob }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a job posting
 * @route   DELETE /api/jobs/:id
 * @access  Private (Employer, Admin)
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get jobs created by current employer
 * @route   GET /api/jobs/my/listings
 * @access  Private (Employer)
 */
exports.getMyEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id })
      .populate('company')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};
