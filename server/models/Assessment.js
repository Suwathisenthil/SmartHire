const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  options: { type: [String], required: true, validate: v => v.length >= 2 },
  correctAnswer: { type: Number, required: true, min: 0 },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' }
}, { _id: true });

const assessmentSchema = new mongoose.Schema({
  skill: { type: String, required: true, unique: true, trim: true },
  category: { type: String, default: 'Technical' },
  description: { type: String, default: '' },
  passPercent: { type: Number, default: 80, min: 1, max: 100 },
  questions: { type: [questionSchema], required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Assessment', assessmentSchema);
