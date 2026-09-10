const User = require('../models/User');
const { normalizeSkillList } = require('../services/matchingService');

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('company').populate('resume');
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get candidate profile by ID (for Employer/Admin review)
 * @route   GET /api/users/candidate/:id
 * @access  Private (Employer, Admin)
 */
exports.getCandidateById = async (req, res, next) => {
  try {
    const candidate = await User.findById(req.params.id).populate('resume');
    if (!candidate || candidate.role !== 'candidate') {
      return res.status(404).json({
        success: false,
        message: 'Candidate profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { candidate }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update basic profile details
 * @route   PUT /api/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, location, headline, bio, profileImage, totalExperienceYears, skills } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (location !== undefined) fieldsToUpdate.location = location;
    if (headline !== undefined) fieldsToUpdate.headline = headline;
    if (bio !== undefined) fieldsToUpdate.bio = bio;
    if (profileImage !== undefined) fieldsToUpdate.profileImage = profileImage;
    if (totalExperienceYears !== undefined) fieldsToUpdate.totalExperienceYears = Number(totalExperienceYears) || 0;
    if (skills !== undefined) {
      fieldsToUpdate.skills = normalizeSkillList(skills);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).populate('company').populate('resume');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add experience entry
 * @route   POST /api/users/experience
 * @access  Private (Candidate)
 */
exports.addExperience = async (req, res, next) => {
  try {
    const { title, company, location, startDate, endDate, current, description, years } = req.body;

    const user = await User.findById(req.user._id);
    user.experience.unshift({
      title,
      company,
      location,
      startDate,
      endDate,
      current: Boolean(current),
      description,
      years: Number(years) || 1
    });

    // Recompute total experience years if not manually overridden
    const computedExp = user.experience.reduce((acc, curr) => acc + (curr.years || 0), 0);
    user.totalExperienceYears = computedExp;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Experience added',
      data: { experience: user.experience, totalExperienceYears: user.totalExperienceYears }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete experience entry
 * @route   DELETE /api/users/experience/:expId
 * @access  Private (Candidate)
 */
exports.deleteExperience = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.experience = user.experience.filter(e => e._id.toString() !== req.params.expId);

    const computedExp = user.experience.reduce((acc, curr) => acc + (curr.years || 0), 0);
    user.totalExperienceYears = computedExp;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Experience entry deleted',
      data: { experience: user.experience, totalExperienceYears: user.totalExperienceYears }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add education entry
 * @route   POST /api/users/education
 * @access  Private (Candidate)
 */
exports.addEducation = async (req, res, next) => {
  try {
    const { degree, fieldOfStudy, institution, startYear, endYear, grade } = req.body;

    const user = await User.findById(req.user._id);
    user.education.unshift({
      degree,
      fieldOfStudy,
      institution,
      startYear: Number(startYear),
      endYear: Number(endYear),
      grade
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Education added',
      data: { education: user.education }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete education entry
 * @route   DELETE /api/users/education/:eduId
 * @access  Private (Candidate)
 */
exports.deleteEducation = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.education = user.education.filter(e => e._id.toString() !== req.params.eduId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Education entry deleted',
      data: { education: user.education }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add certification
 * @route   POST /api/users/certifications
 * @access  Private (Candidate)
 */
exports.addCertification = async (req, res, next) => {
  try {
    const { name, issuingOrganization, issueDate, credentialUrl } = req.body;

    const user = await User.findById(req.user._id);
    user.certifications.unshift({
      name,
      issuingOrganization,
      issueDate,
      credentialUrl
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Certification added',
      data: { certifications: user.certifications }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete certification
 * @route   DELETE /api/users/certifications/:certId
 * @access  Private (Candidate)
 */
exports.deleteCertification = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.certifications = user.certifications.filter(c => c._id.toString() !== req.params.certId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Certification deleted',
      data: { certifications: user.certifications }
    });
  } catch (error) {
    next(error);
  }
};
