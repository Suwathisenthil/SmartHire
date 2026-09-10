const { normalizeSkill } = require('./skillDictionary');

/**
 * Normalizes a list of skills to canonical names and returns a unique set.
 * @param {string[]} skills
 * @returns {string[]}
 */
function normalizeSkillList(skills = []) {
  if (!Array.isArray(skills)) return [];
  const normalized = new Set();
  skills.forEach(s => {
    const canon = normalizeSkill(s);
    if (canon) normalized.add(canon);
  });
  return Array.from(normalized);
}

/**
 * Evaluates education match score (0 - 100)
 */
function calculateEducationScore(candidateEducations = [], requiredEducation = '') {
  if (!requiredEducation || requiredEducation.toLowerCase().includes('any')) {
    return 100;
  }

  if (!candidateEducations || candidateEducations.length === 0) {
    return 40; // baseline if no education recorded
  }

  const reqLower = requiredEducation.toLowerCase();
  const degrees = candidateEducations.map(e => (e.degree || '').toLowerCase());

  // Check higher degree match
  const isMasterOrAbove = degrees.some(d =>
    d.includes('m.tech') || d.includes('mca') || d.includes('ms') || d.includes('master') || d.includes('phd')
  );
  const isBachelor = degrees.some(d =>
    d.includes('b.tech') || d.includes('b.e') || d.includes('bachelor') || d.includes('bca') || d.includes('b.sc')
  );

  if (reqLower.includes('master') || reqLower.includes('m.tech') || reqLower.includes('mca')) {
    if (isMasterOrAbove) return 100;
    if (isBachelor) return 75;
    return 50;
  }

  if (reqLower.includes('bachelor') || reqLower.includes('b.tech') || reqLower.includes('b.e') || reqLower.includes('degree')) {
    if (isMasterOrAbove) return 100;
    if (isBachelor) return 100;
    return 60;
  }

  // General presence of higher education
  return 80;
}

/**
 * Evaluates certification score (0 - 100)
 */
function calculateCertificationScore(candidateCerts = [], matchedSkills = []) {
  if (!candidateCerts || candidateCerts.length === 0) {
    return 40; // baseline when no certification uploaded
  }

  let score = 50 + Math.min(candidateCerts.length * 15, 30); // 1 cert = 65, 2 certs = 80

  // Bonus if certification matches any required skills
  const certNames = candidateCerts.map(c => (c.name || '').toLowerCase()).join(' ');
  const relevantMatches = matchedSkills.some(skill => certNames.includes(skill.toLowerCase()));

  if (relevantMatches) {
    score = Math.min(score + 20, 100);
  }

  return Math.min(score, 100);
}

/**
 * Calculates deterministic match score between a candidate and a job
 *
 * Scoring Formula:
 * Overall Score = (SkillScore * 0.60) + (ExperienceScore * 0.20) + (EducationScore * 0.10) + (CertificationScore * 0.10)
 *
 * @param {object} candidate - User candidate document or object with skills, experience, education, certifications
 * @param {object} job - Job document or object with requiredSkills, preferredSkills, requiredExperience, education
 * @returns {object} Full match breakdown and explainable stats
 */
function calculateJobMatch(candidate, job) {
  // 1. Gather all candidate skills (from profile + parsed resume)
  const rawCandidateSkills = [
    ...(candidate.skills || []),
    ...(candidate.resume?.extractedSkills || [])
  ];
  const candidateSkills = normalizeSkillList(rawCandidateSkills);
  const candidateSkillsSet = new Set(candidateSkills.map(s => s.toLowerCase()));

  // 2. Normalize job skills
  const requiredSkills = normalizeSkillList(job.requiredSkills || []);
  const preferredSkills = normalizeSkillList(job.preferredSkills || []);

  // 3. Find matched and missing required skills
  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    if (candidateSkillsSet.has(skill.toLowerCase())) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // 4. Find matched preferred skills
  const preferredSkillsMatched = [];
  preferredSkills.forEach(skill => {
    if (candidateSkillsSet.has(skill.toLowerCase())) {
      preferredSkillsMatched.push(skill);
    }
  });

  // 5. Calculate Skill Score (60% weight)
  let skillScore = 100;
  if (requiredSkills.length > 0) {
    const requiredCoverage = (matchedSkills.length / requiredSkills.length) * 100;
    // Preferred skill bonus (up to 10 points)
    let bonus = 0;
    if (preferredSkills.length > 0) {
      bonus = (preferredSkillsMatched.length / preferredSkills.length) * 10;
    }
    skillScore = Math.min(Math.round(requiredCoverage + bonus), 100);
  }

  // 6. Calculate Experience Score (20% weight)
  const reqExp = job.requiredExperience || 0;
  let candExp = candidate.totalExperienceYears;
  if (typeof candExp !== 'number' || isNaN(candExp)) {
    // Calculate from experience array if totalExperienceYears not populated
    candExp = 0;
    if (Array.isArray(candidate.experience)) {
      candidate.experience.forEach(exp => {
        candExp += (exp.years || 1);
      });
    }
  }

  let experienceScore = 100;
  let experienceMatch = true;
  if (reqExp > 0) {
    if (candExp >= reqExp) {
      experienceScore = 100;
      experienceMatch = true;
    } else {
      experienceScore = Math.min(Math.round((candExp / reqExp) * 100), 100);
      experienceMatch = candExp >= (reqExp * 0.7); // tolerant match threshold
    }
  }

  // 7. Calculate Education Score (10% weight)
  const educationScore = calculateEducationScore(candidate.education, job.education);
  const educationMatch = educationScore >= 70;

  // 8. Calculate Certification Score (10% weight)
  const certificationScore = calculateCertificationScore(candidate.certifications, matchedSkills);

  // 9. Weighted Overall Score (Clamped strictly 0 - 100)
  const rawOverall =
    (skillScore * 0.60) +
    (experienceScore * 0.20) +
    (educationScore * 0.10) +
    (certificationScore * 0.10);

  const overallScore = Math.min(Math.max(Math.round(rawOverall), 0), 100);

  return {
    score: overallScore,
    skillScore: Math.round(skillScore),
    experienceScore: Math.round(experienceScore),
    educationScore: Math.round(educationScore),
    certificationScore: Math.round(certificationScore),
    matchedSkills,
    missingSkills,
    preferredSkillsMatched,
    candidateTotalExperience: candExp,
    jobRequiredExperience: reqExp,
    experienceMatch,
    educationMatch
  };
}

/**
 * Calculates aggregated skill gap analysis for a candidate against all active jobs in the market
 * @param {object} candidate
 * @param {Array} activeJobs
 * @returns {object} { currentSkills, missingSkillsWithFrequency, recommendedSkillsToLearn }
 */
function analyzeSkillGap(candidate, activeJobs = []) {
  const rawCandidateSkills = [
    ...(candidate.skills || []),
    ...(candidate.resume?.extractedSkills || [])
  ];
  const candidateSkills = normalizeSkillList(rawCandidateSkills);
  const candidateSkillsSet = new Set(candidateSkills.map(s => s.toLowerCase()));

  // Count frequency of required skills in active jobs that candidate doesn't have
  const missingSkillFrequency = {};
  const totalRelevantJobs = activeJobs.length;

  activeJobs.forEach(job => {
    const reqSkills = normalizeSkillList(job.requiredSkills || []);
    reqSkills.forEach(skill => {
      if (!candidateSkillsSet.has(skill.toLowerCase())) {
        missingSkillFrequency[skill] = (missingSkillFrequency[skill] || 0) + 1;
      }
    });
  });

  // Sort missing skills by market demand
  const recommendedSkillsToLearn = Object.entries(missingSkillFrequency)
    .map(([skill, count]) => ({
      skill,
      demandCount: count,
      demandPercentage: totalRelevantJobs > 0 ? Math.round((count / totalRelevantJobs) * 100) : 0
    }))
    .sort((a, b) => b.demandCount - a.demandCount)
    .slice(0, 10); // top 10

  return {
    currentSkills: candidateSkills,
    totalCurrentSkills: candidateSkills.length,
    missingSkillsCount: Object.keys(missingSkillFrequency).length,
    recommendedSkillsToLearn
  };
}

module.exports = {
  calculateJobMatch,
  analyzeSkillGap,
  normalizeSkillList
};
