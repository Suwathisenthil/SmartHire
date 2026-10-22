const LearningProgress = require('../models/LearningProgress');
const VerifiedSkill = require('../models/VerifiedSkill');
const { normalizeSkillList } = require('./matchingService');

const RESOURCE_MAP = {
  JavaScript: [
    { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'Documentation' },
    { title: 'JavaScript Practice', url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/', type: 'Practice' }
  ],
  React: [
    { title: 'React Learn', url: 'https://react.dev/learn', type: 'Documentation' },
    { title: 'React Practice', url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/react/', type: 'Practice' }
  ],
  'Node.js': [
    { title: 'Node.js Learn', url: 'https://nodejs.org/en/learn', type: 'Documentation' },
    { title: 'Node.js Practice', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', type: 'Practice' }
  ],
  Java: [
    { title: 'Oracle Java Tutorials', url: 'https://dev.java/learn/', type: 'Documentation' },
    { title: 'Java Practice', url: 'https://www.hackerrank.com/domains/java', type: 'Practice' }
  ],
  Python: [
    { title: 'Python Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'Documentation' },
    { title: 'Python Practice', url: 'https://www.hackerrank.com/domains/python', type: 'Practice' }
  ],
  SQL: [
    { title: 'PostgreSQL Tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', type: 'Documentation' },
    { title: 'SQL Practice', url: 'https://www.hackerrank.com/domains/sql', type: 'Practice' }
  ]
};

function resourcesFor(skill) {
  return RESOURCE_MAP[skill] || [
    { title: `${skill} documentation`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' official documentation')}`, type: 'Documentation' },
    { title: `${skill} practice`, url: `https://www.google.com/search?q=${encodeURIComponent(skill + ' practice exercises')}`, type: 'Practice' }
  ];
}

async function syncRoadmap(candidateId, recommendedSkills = []) {
  const normalized = normalizeSkillList(recommendedSkills.map(item => item.skill));
  const verified = await VerifiedSkill.find({ candidate: candidateId }).lean();
  const verifiedMap = new Map(verified.map(v => [v.skill.toLowerCase(), v]));

  const rows = [];
  for (let i = 0; i < recommendedSkills.length; i += 1) {
    const item = recommendedSkills[i];
    const skill = normalized[i] || item.skill;
    const existing = await LearningProgress.findOne({ candidate: candidateId, skill });
    const verifiedSkill = verifiedMap.get(skill.toLowerCase());

    const update = {
      priority: i + 1,
      demandCount: item.demandCount || 0,
      demandPercentage: item.demandPercentage || 0,
      estimatedHours: existing?.estimatedHours || Math.max(4, Math.round(20 - Math.min(item.demandPercentage || 0, 80) / 5)),
      resources: resourcesFor(skill)
    };

    if (verifiedSkill) {
      update.progressPercent = 100;
      update.status = 'Verified';
    }

    const row = await LearningProgress.findOneAndUpdate(
      { candidate: candidateId, skill },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    rows.push(row);
  }
  return rows;
}

module.exports = { syncRoadmap, resourcesFor };
