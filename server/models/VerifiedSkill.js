const mongoose = require('mongoose');

const verifiedSkillSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skill: { type: String, required: true, trim: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  level: { type: String, enum: ['Developing', 'Proficient', 'Strong'], required: true },
  assessmentAttempt: { type: mongoose.Schema.Types.ObjectId, ref: 'AssessmentAttempt', required: true },
  verifiedAt: { type: Date, default: Date.now }
}, { timestamps: true });

verifiedSkillSchema.index({ candidate: 1, skill: 1 }, { unique: true });
module.exports = mongoose.model('VerifiedSkill', verifiedSkillSchema);
