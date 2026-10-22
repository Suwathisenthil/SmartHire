const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ['Documentation', 'Course', 'Practice'], default: 'Documentation' }
}, { _id: false });

const learningProgressSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skill: { type: String, required: true, trim: true },
  priority: { type: Number, default: 1, min: 1 },
  demandCount: { type: Number, default: 0, min: 0 },
  demandPercentage: { type: Number, default: 0, min: 0, max: 100 },
  estimatedHours: { type: Number, default: 8, min: 1 },
  progressPercent: { type: Number, default: 0, min: 0, max: 100 },
  status: { type: String, enum: ['Not Started', 'In Progress', 'Completed', 'Verified'], default: 'Not Started' },
  resources: { type: [resourceSchema], default: [] },
  lastActivityAt: { type: Date }
}, { timestamps: true });

learningProgressSchema.index({ candidate: 1, skill: 1 }, { unique: true });
module.exports = mongoose.model('LearningProgress', learningProgressSchema);
