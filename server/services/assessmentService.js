const { normalizeSkillList } = require('./matchingService');

function levelForScore(score) {
  if (score >= 90) return 'Strong';
  if (score >= 80) return 'Proficient';
  return 'Developing';
}

function gradeAssessment(assessment, submittedAnswers = []) {
  const answerMap = new Map(
    submittedAnswers.map(a => [String(a.questionId), Number(a.selectedAnswer)])
  );
  let correctCount = 0;
  const answers = [];

  assessment.questions.forEach(question => {
    const selectedAnswer = answerMap.get(String(question._id));
    const isCorrect = Number.isInteger(selectedAnswer) && selectedAnswer === question.correctAnswer;
    if (isCorrect) correctCount += 1;
    answers.push({ questionId: question._id, selectedAnswer });
  });

  const totalQuestions = assessment.questions.length;
  const score = totalQuestions ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const passed = score >= assessment.passPercent;
  return { score, correctCount, totalQuestions, passed, answers, level: levelForScore(score) };
}

function normalizeAssessmentSkill(skill) {
  return normalizeSkillList([skill])[0] || skill.trim();
}

module.exports = { gradeAssessment, levelForScore, normalizeAssessmentSkill };
