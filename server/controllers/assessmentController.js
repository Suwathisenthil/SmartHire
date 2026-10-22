const Assessment = require('../models/Assessment');
const AssessmentAttempt = require('../models/AssessmentAttempt');
const VerifiedSkill = require('../models/VerifiedSkill');
const LearningProgress = require('../models/LearningProgress');
const Notification = require('../models/Notification');
const { gradeAssessment, normalizeAssessmentSkill } = require('../services/assessmentService');

exports.listAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ active: true }).select('skill category description passPercent questions createdAt');
    const attempts = await AssessmentAttempt.find({ candidate: req.user._id }).sort({ createdAt: -1 }).lean();
    const latestByAssessment = new Map();
    attempts.forEach(a => {
      const id = String(a.assessment);
      if (!latestByAssessment.has(id)) latestByAssessment.set(id, a);
    });

    res.json({
      success: true,
      data: {
        assessments: assessments.map(a => ({
          _id: a._id,
          skill: a.skill,
          category: a.category,
          description: a.description,
          passPercent: a.passPercent,
          questionCount: a.questions.length,
          latestAttempt: latestByAssessment.get(String(a._id)) || null
        }))
      }
    });
  } catch (error) { next(error); }
};

exports.getAssessment = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, active: true });
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });

    // Never expose correctAnswer to the client.
    const questions = assessment.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty
    }));
    res.json({
      success: true,
      data: { _id: assessment._id, skill: assessment.skill, description: assessment.description, passPercent: assessment.passPercent, questions }
    });
  } catch (error) { next(error); }
};

exports.submitAttempt = async (req, res, next) => {
  try {
    const assessment = await Assessment.findOne({ _id: req.params.id, active: true });
    if (!assessment) return res.status(404).json({ success: false, message: 'Assessment not found.' });

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    const graded = gradeAssessment(assessment, answers);

    const attempt = await AssessmentAttempt.create({
      candidate: req.user._id,
      assessment: assessment._id,
      answers: graded.answers,
      score: graded.score,
      correctCount: graded.correctCount,
      totalQuestions: graded.totalQuestions,
      passed: graded.passed
    });

    const skill = normalizeAssessmentSkill(assessment.skill);
    let verifiedSkill = null;
    if (graded.passed) {
      verifiedSkill = await VerifiedSkill.findOneAndUpdate(
        { candidate: req.user._id, skill },
        {
          $set: { score: graded.score, level: graded.level, assessmentAttempt: attempt._id, verifiedAt: new Date() }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      await LearningProgress.findOneAndUpdate(
        { candidate: req.user._id, skill },
        { $set: { progressPercent: 100, status: 'Verified', lastActivityAt: new Date() } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    await Notification.create({
      recipient: req.user._id,
      type: 'system',
      title: graded.passed ? `${skill} skill verified` : `${skill} assessment result`,
      message: graded.passed
        ? `You scored ${graded.score}%. Your ${skill} skill is now verified.`
        : `You scored ${graded.score}%. ${assessment.passPercent}% is required to verify ${skill}.`
    });

    res.status(201).json({
      success: true,
      message: graded.passed ? `${skill} verified successfully.` : 'Assessment submitted. You can try again.',
      data: {
        attempt: {
          _id: attempt._id,
          score: graded.score,
          correctCount: graded.correctCount,
          totalQuestions: graded.totalQuestions,
          passed: graded.passed,
          passPercent: assessment.passPercent,
          completedAt: attempt.completedAt
        },
        verifiedSkill
      }
    });
  } catch (error) { next(error); }
};

exports.getMyAttempts = async (req, res, next) => {
  try {
    const attempts = await AssessmentAttempt.find({ candidate: req.user._id })
      .populate('assessment', 'skill passPercent')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: { attempts } });
  } catch (error) { next(error); }
};

exports.getMyVerifiedSkills = async (req, res, next) => {
  try {
    const skills = await VerifiedSkill.find({ candidate: req.user._id }).sort({ score: -1, skill: 1 });
    res.json({ success: true, data: { skills } });
  } catch (error) { next(error); }
};
