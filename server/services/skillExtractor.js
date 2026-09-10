const { SKILL_DICTIONARY, normalizeSkill } = require('./skillDictionary');

// Helper to escape regex special characters except letters and numbers
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Extracts normalized skills from free-form text
 * @param {string} text - Raw text from resume or description
 * @returns {string[]} Array of unique canonical skill names
 */
function extractSkills(text) {
  if (!text || typeof text !== 'string') return [];

  const foundSkills = new Set();
  const lowerText = text.toLowerCase();

  for (const item of SKILL_DICTIONARY) {
    const allTerms = [item.name, ...item.aliases];

    for (const term of allTerms) {
      const lowerTerm = term.toLowerCase();
      let pattern;
      if (/^[a-z0-9]+$/i.test(lowerTerm)) {
        pattern = new RegExp(`\\b${escapeRegex(lowerTerm)}\\b`, 'i');
      } else {
        pattern = new RegExp(`(?:^|\\s|[.,;\\/\\(\\)\\[\\]])${escapeRegex(lowerTerm)}(?:$|\\s|[.,;\\/\\(\\)\\[\\]])`, 'i');
      }

      if (pattern.test(lowerText)) {
        foundSkills.add(item.name);
        break; // matched this skill, move to next
      }
    }
  }

  return Array.from(foundSkills);
}

/**
 * Extracts estimated years of experience, degrees, and contact information
 * @param {string} text - Raw text from resume
 */
function extractMetadata(text) {
  if (!text || typeof text !== 'string') {
    return { experienceYears: 0, degreeHints: [], contactEmail: '', contactPhone: '' };
  }

  // 1. Email extraction
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const contactEmail = emailMatch ? emailMatch[0].toLowerCase() : '';

  // 2. Phone extraction (Indian & international formats)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?91[-.\s]?[6-9]\d{9}/);
  const contactPhone = phoneMatch ? phoneMatch[0].trim() : '';

  // 3. Experience years extraction (e.g. "3+ years of experience", "5 years experience", "4.5 yrs")
  let experienceYears = 0;
  const expMatches = text.matchAll(/(\d+(?:\.\d+)?)\s*(?:\+|plus)?\s*(?:years?|yrs?)(?:\s+of)?\s+experience/gi);
  for (const m of expMatches) {
    const val = parseFloat(m[1]);
    if (val > experienceYears && val < 50) {
      experienceYears = val;
    }
  }

  // 4. Degree hints
  const degreeHints = [];
  const degreePatterns = [
    { degree: 'Ph.D / Doctorate', regex: /\b(ph\.?d|doctorate)\b/i },
    { degree: 'M.Tech / M.E / MS', regex: /\b(m\.?tech|m\.?e\.?|master of technology|m\.?s\.?|master of science)\b/i },
    { degree: 'MCA', regex: /\b(mca|master of computer applications)\b/i },
    { degree: 'MBA', regex: /\b(mba|master of business administration)\b/i },
    { degree: 'B.Tech / B.E', regex: /\b(b\.?tech|b\.?e\.?|bachelor of technology|bachelor of engineering)\b/i },
    { degree: 'BCA / B.Sc', regex: /\b(bca|b\.?sc|bachelor of computer applications|bachelor of science)\b/i },
    { degree: 'Diploma', regex: /\b(diploma|polytechnic)\b/i }
  ];

  for (const item of degreePatterns) {
    if (item.regex.test(text)) {
      degreeHints.push(item.degree);
    }
  }

  return {
    experienceYears: Math.round(experienceYears * 10) / 10,
    degreeHints,
    contactEmail,
    contactPhone
  };
}

module.exports = {
  extractSkills,
  extractMetadata
};
