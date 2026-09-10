const Company = require('../models/Company');
const User = require('../models/User');

/**
 * @desc    Create company profile
 * @route   POST /api/companies
 * @access  Private (Employer)
 */
exports.createCompany = async (req, res, next) => {
  try {
    const existingCompany = await Company.findOne({ employer: req.user._id });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'You already have a registered company profile.'
      });
    }

    const { name, description, industry, location, website, logo, size } = req.body;

    const company = await Company.create({
      employer: req.user._id,
      name,
      description,
      industry,
      location,
      website,
      logo,
      size,
      status: 'Approved'
    });

    await User.findByIdAndUpdate(req.user._id, { company: company._id });

    res.status(201).json({
      success: true,
      message: 'Company profile created successfully',
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current employer company
 * @route   GET /api/companies/my
 * @access  Private (Employer)
 */
exports.getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({ employer: req.user._id });
    res.status(200).json({
      success: true,
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company profile
 * @route   PUT /api/companies/:id
 * @access  Private (Employer, Admin)
 */
exports.updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Must be company owner or admin
    if (company.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: { company: updated }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all active/approved companies
 * @route   GET /api/companies
 * @access  Public
 */
exports.getAllCompanies = async (req, res, next) => {
  try {
    const filter = req.user && req.user.role === 'admin' ? {} : { status: 'Approved' };
    const companies = await Company.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: { companies }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single company by ID
 * @route   GET /api/companies/:id
 * @access  Public
 */
exports.getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }
    res.status(200).json({
      success: true,
      data: { company }
    });
  } catch (error) {
    next(error);
  }
};
