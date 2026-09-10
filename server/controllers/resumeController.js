const path = require('path');
const fs = require('fs');
const Resume = require('../models/Resume');
const User = require('../models/User');
const { parseResumeFile } = require('../services/resumeParser');
const { normalizeSkillList } = require('../services/matchingService');

/**
 * @desc    Upload and parse candidate resume (PDF or DOCX)
 * @route   POST /api/resumes/upload
 * @access  Private (Candidate)
 */
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume file (PDF or DOCX).'
      });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase().replace('.', '');
    const fileType = fileExt === 'pdf' ? 'pdf' : 'docx';

    // Parse the file locally
    const parseResult = await parseResumeFile(filePath, fileType);

    // Check if candidate already has a resume record
    let resume = await Resume.findOne({ candidate: req.user._id });

    if (resume) {
      // Clean up old file if different
      if (resume.path && fs.existsSync(resume.path) && resume.path !== filePath) {
        try { fs.unlinkSync(resume.path); } catch (err) { /* ignore cleanup error */ }
      }

      resume.originalFilename = req.file.originalname;
      resume.filename = req.file.filename;
      resume.path = filePath;
      resume.fileType = fileType;
      resume.fileSize = req.file.size;
      resume.extractedText = parseResult.text;
      resume.extractedSkills = parseResult.skills;
      resume.parsedDetails = {
        experienceYears: parseResult.metadata.experienceYears,
        degreeHints: parseResult.metadata.degreeHints,
        contactEmail: parseResult.metadata.contactEmail,
        contactPhone: parseResult.metadata.contactPhone
      };
      resume.uploadDate = new Date();
      await resume.save();
    } else {
      resume = await Resume.create({
        candidate: req.user._id,
        originalFilename: req.file.originalname,
        filename: req.file.filename,
        path: filePath,
        fileType,
        fileSize: req.file.size,
        extractedText: parseResult.text,
        extractedSkills: parseResult.skills,
        parsedDetails: {
          experienceYears: parseResult.metadata.experienceYears,
          degreeHints: parseResult.metadata.degreeHints,
          contactEmail: parseResult.metadata.contactEmail,
          contactPhone: parseResult.metadata.contactPhone
        }
      });
    }

    // Merge extracted skills into candidate's user profile skills
    const user = await User.findById(req.user._id);
    const existingSkills = user.skills || [];
    const mergedSkills = normalizeSkillList([...existingSkills, ...parseResult.skills]);

    user.skills = mergedSkills;
    user.resume = resume._id;

    // If candidate has no experience set, use parsed experience if found
    if (!user.totalExperienceYears && parseResult.metadata.experienceYears > 0) {
      user.totalExperienceYears = parseResult.metadata.experienceYears;
    }

    // If candidate phone is empty and resume has contactPhone, fill it
    if (!user.phone && parseResult.metadata.contactPhone) {
      user.phone = parseResult.metadata.contactPhone;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume parsed and skills extracted successfully',
      data: {
        resume,
        extractedSkills: resume.extractedSkills,
        userSkills: user.skills,
        parsedDetails: resume.parsedDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current candidate resume
 * @route   GET /api/resumes/my
 * @access  Private (Candidate)
 */
exports.getMyResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ candidate: req.user._id });
    res.status(200).json({
      success: true,
      data: { resume }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update candidate's extracted skills manually
 * @route   PUT /api/resumes/skills
 * @access  Private (Candidate)
 */
exports.updateExtractedSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({
        success: false,
        message: 'Skills must be an array of skill names'
      });
    }

    const normalized = normalizeSkillList(skills);

    // Update resume skills
    const resume = await Resume.findOneAndUpdate(
      { candidate: req.user._id },
      { $set: { extractedSkills: normalized } },
      { new: true }
    );

    // Also update User profile skills
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { skills: normalized } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Skills updated successfully',
      data: {
        skills: normalized,
        resume,
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete candidate resume
 * @route   DELETE /api/resumes/my
 * @access  Private (Candidate)
 */
exports.deleteResume = async (req, res, next) => {
  try {
    const resume = await Resume.findOne({ candidate: req.user._id });
    if (resume) {
      if (resume.path && fs.existsSync(resume.path)) {
        try { fs.unlinkSync(resume.path); } catch (e) { /* ignore */ }
      }
      await Resume.findByIdAndDelete(resume._id);
      await User.findByIdAndUpdate(req.user._id, { $unset: { resume: 1 } });
    }

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
