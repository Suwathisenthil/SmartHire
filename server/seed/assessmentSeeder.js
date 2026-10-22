const Assessment = require('../models/Assessment');
const { seedAssessments } = require('./assessmentData');

async function ensureAssessments() {
  let created = 0;
  let existing = 0;
  for (const assessment of seedAssessments) {
    const found = await Assessment.findOne({ skill: assessment.skill }).select('_id');
    if (found) {
      existing += 1;
      continue;
    }
    await Assessment.create(assessment);
    created += 1;
  }
  return { created, existing, total: seedAssessments.length };
}

module.exports = { ensureAssessments };
