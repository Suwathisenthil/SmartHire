const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Interview = require('../models/Interview');

/**
 * @desc    Get admin dashboard statistics and analytics
 * @route   GET /api/admin/dashboard
 * @access  Private (Admin)
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const candidatesCount = await User.countDocuments({ role: 'candidate' });
    const employersCount = await User.countDocuments({ role: 'employer' });

    const totalCompanies = await Company.countDocuments();
    const pendingCompanies = await Company.countDocuments({ status: 'Pending' });
    const approvedCompanies = await Company.countDocuments({ status: 'Approved' });

    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'Active' });
    const closedJobs = await Job.countDocuments({ status: 'Closed' });

    const totalApplications = await Application.countDocuments();
    const shortlistedCount = await Application.countDocuments({ status: 'Shortlisted' });
    const selectedCount = await Application.countDocuments({ status: 'Selected' });
    const interviewsCount = await Interview.countDocuments();

    // Top skills aggregated from active jobs
    const topSkillsAgg = await Job.aggregate([
      { $match: { status: 'Active' } },
      { $unwind: '$requiredSkills' },
      { $group: { _id: '$requiredSkills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    // Application status distribution
    const statusDistribution = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Average match score across all applications
    const avgScoreResult = await Application.aggregate([
      { $group: { _id: null, avgScore: { $avg: '$matchScore' } } }
    ]);
    const averageMatchScore = avgScoreResult.length > 0 ? Math.round(avgScoreResult[0].avgScore) : 0;

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalUsers,
          candidatesCount,
          employersCount,
          totalCompanies,
          pendingCompanies,
          approvedCompanies,
          totalJobs,
          activeJobs,
          closedJobs,
          totalApplications,
          shortlistedCount,
          selectedCount,
          interviewsCount,
          averageMatchScore
        },
        topSkills: topSkillsAgg.map(s => ({ skill: s._id, count: s.count })),
        statusDistribution: statusDistribution.map(s => ({ status: s._id, count: s.count }))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered users
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .populate('company', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: {
        users,
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
 * @desc    Toggle user active state
 * @route   PUT /api/admin/users/:id/status
 * @access  Private (Admin)
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Admin cannot deactivate their own account.'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Admin accounts cannot be deleted directly.'
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all companies for admin moderation
 * @route   GET /api/admin/companies
 * @access  Private (Admin)
 */
exports.getAllCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find()
      .populate('employer', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { companies }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve or reject company
 * @route   PUT /api/admin/companies/:id/status
 * @access  Private (Admin)
 */
exports.updateCompanyStatus = async (req, res, next) => {
  try {
    const { status, verificationNotes } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Approved, Rejected, or Pending.'
      });
    }

    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { status, verificationNotes: verificationNotes || '' } },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Company status updated to ${status}`,
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all jobs for moderation
 * @route   GET /api/admin/jobs
 * @access  Private (Admin)
 */
exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'name location')
      .populate('employer', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { jobs }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update job status by Admin
 * @route   PUT /api/admin/jobs/:id/status
 * @access  Private (Admin)
 */
exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Active', 'Closed', 'Draft'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Job status updated to ${status}`,
      data: { job }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications across platform
 * @route   GET /api/admin/applications
 * @access  Private (Admin)
 */
exports.getAllApplications = async (req, res, next) => {
  try {
    const applications = await Application.find()
      .populate('candidate', 'name email phone headline skills')
      .populate('job', 'title location workMode')
      .populate('company', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { applications }
    });
  } catch (error) {
    next(error);
  }
};
