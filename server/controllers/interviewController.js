const Interview = require('../models/Interview');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

/**
 * @desc    Schedule an interview
 * @route   POST /api/interviews
 * @access  Private (Employer)
 */
exports.scheduleInterview = async (req, res, next) => {
  try {
    const { applicationId, date, time, interviewType, meetingLink, location, notes } = req.body;

    if (!applicationId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide application ID, interview date, and time.'
      });
    }

    const application = await Application.findById(applicationId)
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
        message: 'Not authorized to schedule interview for this application'
      });
    }

    const interview = await Interview.create({
      application: application._id,
      candidate: application.candidate,
      employer: req.user._id,
      job: application.job._id,
      company: application.company._id,
      date,
      time,
      interviewType: interviewType || 'Online',
      meetingLink: meetingLink || '',
      location: location || '',
      notes: notes || '',
      status: 'Scheduled'
    });

    // Update application status to Interview Scheduled
    application.status = 'Interview Scheduled';
    application.statusHistory.push({
      status: 'Interview Scheduled',
      date: new Date(),
      notes: `Interview scheduled on ${new Date(date).toLocaleDateString()} at ${time} (${interviewType || 'Online'})`,
      updatedBy: req.user._id
    });
    await application.save();

    // Create notification for Candidate
    await Notification.create({
      recipient: application.candidate,
      sender: req.user._id,
      type: 'interview',
      title: 'Interview Scheduled!',
      message: `${application.company?.name} has scheduled an interview with you for "${application.job?.title}" on ${new Date(date).toLocaleDateString()} at ${time}.`,
      link: '/candidate/interviews',
      relatedEntity: { entityType: 'Interview', entityId: interview._id }
    });

    const populatedInterview = await Interview.findById(interview._id)
      .populate('candidate', 'name email phone headline')
      .populate('job', 'title location')
      .populate('company', 'name logo');

    res.status(201).json({
      success: true,
      message: 'Interview scheduled successfully',
      data: { interview: populatedInterview }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all interviews for current user (Candidate or Employer)
 * @route   GET /api/interviews
 * @access  Private
 */
exports.getMyInterviews = async (req, res, next) => {
  try {
    const filter = req.user.role === 'candidate'
      ? { candidate: req.user._id }
      : { employer: req.user._id };

    const interviews = await Interview.find(filter)
      .populate('candidate', 'name email phone headline skills')
      .populate('job', 'title location workMode')
      .populate('company', 'name logo location')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: { interviews }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update interview status or details
 * @route   PUT /api/interviews/:id
 * @access  Private (Employer, Admin)
 */
exports.updateInterview = async (req, res, next) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('job', 'title')
      .populate('company', 'name');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    if (interview.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const { status, date, time, meetingLink, location, notes, feedback } = req.body;

    if (status) interview.status = status;
    if (date) interview.date = date;
    if (time) interview.time = time;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;
    if (location !== undefined) interview.location = location;
    if (notes !== undefined) interview.notes = notes;
    if (feedback !== undefined) interview.feedback = feedback;

    await interview.save();

    // Notify candidate of changes
    await Notification.create({
      recipient: interview.candidate,
      sender: req.user._id,
      type: 'interview',
      title: `Interview Update: ${interview.status}`,
      message: `Your interview for "${interview.job?.title}" has been updated. Status: ${interview.status}.`,
      link: '/candidate/interviews',
      relatedEntity: { entityType: 'Interview', entityId: interview._id }
    });

    res.status(200).json({
      success: true,
      message: 'Interview updated successfully',
      data: { interview }
    });
  } catch (error) {
    next(error);
  }
};
