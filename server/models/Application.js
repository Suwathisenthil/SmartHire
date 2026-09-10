const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  notes: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
}, { _id: false });

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
    },
    matchScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    scoreBreakdown: {
      skillScore: { type: Number, default: 0 },
      experienceScore: { type: Number, default: 0 },
      educationScore: { type: Number, default: 0 },
      certificationScore: { type: Number, default: 0 },
    },
    matchedSkills: [{
      type: String,
    }],
    missingSkills: [{
      type: String,
    }],
    preferredSkillsMatched: [{
      type: String,
    }],
    experienceMatch: {
      type: Boolean,
      default: false,
    },
    educationMatch: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: [
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Selected',
        'Rejected',
        'Withdrawn'
      ],
      default: 'Applied',
    },
    statusHistory: [statusHistorySchema],
    coverNote: {
      type: String,
      default: '',
    }
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });
applicationSchema.index({ job: 1, matchScore: -1 });

module.exports = mongoose.model('Application', applicationSchema);
