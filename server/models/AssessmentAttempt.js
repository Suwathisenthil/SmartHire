const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  selectedAnswer: { type: Number, min: 0 }
}, { _id: false });

const assessmentAttemptSchema = new mongoose.Schema({
  candidate: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  answers: { type: [answerSchema], default: [] },
  score: { type: Number, required: true, min: 0, max: 100 },
  correctCount: { type: Number, required: true, min: 0 },
  totalQuestions: { type: Number, required: true, min: 1 },
  passed: { type: Boolean, required: true },
  completedAt: { type: Date, default: Date.now }
}, { timestamps: true });

assessmentAttemptSchema.index({ candidate: 1, assessment: 1, createdAt: -1 });
module.exports = mongoose.model('AssessmentAttempt', assessmentAttemptSchema);
