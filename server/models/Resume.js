const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One active primary resume per candidate
    },
    originalFilename: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'docx'],
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    extractedText: {
      type: String,
      default: '',
    },
    extractedSkills: [{
      type: String,
      trim: true,
    }],
    parsedDetails: {
      experienceYears: { type: Number, default: 0 },
      degreeHints: [{ type: String }],
      contactEmail: { type: String, default: '' },
      contactPhone: { type: String, default: '' }
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
