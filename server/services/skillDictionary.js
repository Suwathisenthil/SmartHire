/**
 * SmartHire Centralized Canonical Skill Dictionary
 * Categorized taxonomy of tech skills with canonical names, categories, and common aliases.
 */

const SKILL_DICTIONARY = [
  // Programming Languages
  { name: 'JavaScript', category: 'Programming', aliases: ['javascript', 'js', 'es6', 'es2015', 'ecmascript'] },
  { name: 'TypeScript', category: 'Programming', aliases: ['typescript', 'ts'] },
  { name: 'Python', category: 'Programming', aliases: ['python', 'python3', 'py'] },
  { name: 'Java', category: 'Programming', aliases: ['java', 'core java', 'j2ee'] },
  { name: 'C', category: 'Programming', aliases: ['c language', 'ansi c'] },
  { name: 'C++', category: 'Programming', aliases: ['c++', 'cpp', 'cplusplus'] },
  { name: 'C#', category: 'Programming', aliases: ['c#', 'csharp', 'c sharp', 'dotnet', '.net'] },
  { name: 'PHP', category: 'Programming', aliases: ['php', 'php7', 'php8'] },
  { name: 'Ruby', category: 'Programming', aliases: ['ruby', 'ruby on rails'] },
  { name: 'Go', category: 'Programming', aliases: ['golang', 'go language'] },
  { name: 'Rust', category: 'Programming', aliases: ['rust', 'rustlang'] },
  { name: 'Kotlin', category: 'Programming', aliases: ['kotlin'] },
  { name: 'Swift', category: 'Programming', aliases: ['swift'] },
  { name: 'Dart', category: 'Programming', aliases: ['dart'] },

  // Frontend
  { name: 'HTML', category: 'Frontend', aliases: ['html', 'html5'] },
  { name: 'CSS', category: 'Frontend', aliases: ['css', 'css3'] },
  { name: 'React', category: 'Frontend', aliases: ['react', 'reactjs', 'react.js', 'react js'] },
  { name: 'Angular', category: 'Frontend', aliases: ['angular', 'angularjs', 'angular.js', 'angular 2+'] },
  { name: 'Vue.js', category: 'Frontend', aliases: ['vue', 'vuejs', 'vue.js', 'vue 3'] },
  { name: 'Next.js', category: 'Frontend', aliases: ['nextjs', 'next.js', 'next'] },
  { name: 'Redux', category: 'Frontend', aliases: ['redux', 'redux toolkit', 'rtk'] },
  { name: 'Tailwind CSS', category: 'Frontend', aliases: ['tailwind', 'tailwindcss', 'tailwind css'] },
  { name: 'Bootstrap', category: 'Frontend', aliases: ['bootstrap', 'bootstrap 5', 'bootstrap 4'] },
  { name: 'Sass', category: 'Frontend', aliases: ['sass', 'scss'] },
  { name: 'Material UI', category: 'Frontend', aliases: ['material ui', 'mui', 'material-ui'] },

  // Backend
  { name: 'Node.js', category: 'Backend', aliases: ['node', 'nodejs', 'node.js', 'node js'] },
  { name: 'Express.js', category: 'Backend', aliases: ['express', 'expressjs', 'express.js', 'express js'] },
  { name: 'Django', category: 'Backend', aliases: ['django', 'django rest framework', 'drf'] },
  { name: 'Flask', category: 'Backend', aliases: ['flask'] },
  { name: 'FastAPI', category: 'Backend', aliases: ['fastapi', 'fast api'] },
  { name: 'Spring Boot', category: 'Backend', aliases: ['spring boot', 'springboot', 'spring framework', 'spring'] },
  { name: 'NestJS', category: 'Backend', aliases: ['nestjs', 'nest.js', 'nest js'] },
  { name: 'GraphQL', category: 'Backend', aliases: ['graphql', 'apollo graphql'] },
  { name: 'REST API', category: 'Backend', aliases: ['rest api', 'restful', 'restful api', 'rest apis'] },
  { name: 'Microservices', category: 'Backend', aliases: ['microservices', 'microservice architecture'] },

  // Database
  { name: 'MongoDB', category: 'Database', aliases: ['mongodb', 'mongo', 'mongoose'] },
  { name: 'MySQL', category: 'Database', aliases: ['mysql', 'my-sql'] },
  { name: 'PostgreSQL', category: 'Database', aliases: ['postgres', 'postgresql', 'psql'] },
  { name: 'SQLite', category: 'Database', aliases: ['sqlite', 'sqlite3'] },
  { name: 'Oracle', category: 'Database', aliases: ['oracle', 'oracle db', 'plsql', 'pl/sql'] },
  { name: 'Redis', category: 'Database', aliases: ['redis'] },
  { name: 'Cassandra', category: 'Database', aliases: ['cassandra', 'apache cassandra'] },
  { name: 'Firebase', category: 'Database', aliases: ['firebase', 'firestore', 'firebase realtime db'] },

  // Cloud & DevOps
  { name: 'AWS', category: 'Cloud / DevOps', aliases: ['aws', 'amazon web services', 'ec2', 's3', 'lambda'] },
  { name: 'Azure', category: 'Cloud / DevOps', aliases: ['azure', 'microsoft azure'] },
  { name: 'Google Cloud', category: 'Cloud / DevOps', aliases: ['gcp', 'google cloud', 'google cloud platform'] },
  { name: 'Docker', category: 'Cloud / DevOps', aliases: ['docker', 'docker compose', 'containerization'] },
  { name: 'Kubernetes', category: 'Cloud / DevOps', aliases: ['kubernetes', 'k8s'] },
  { name: 'Git', category: 'Cloud / DevOps', aliases: ['git', 'version control'] },
  { name: 'GitHub', category: 'Cloud / DevOps', aliases: ['github', 'gitlab', 'bitbucket'] },
  { name: 'CI/CD', category: 'Cloud / DevOps', aliases: ['ci/cd', 'cicd', 'jenkins', 'github actions'] },
  { name: 'Linux', category: 'Cloud / DevOps', aliases: ['linux', 'ubuntu', 'bash', 'shell scripting'] },
  { name: 'Nginx', category: 'Cloud / DevOps', aliases: ['nginx'] },

  // Data / AI / ML
  { name: 'Machine Learning', category: 'Data / AI', aliases: ['machine learning', 'ml', 'scikit-learn', 'sklearn'] },
  { name: 'Deep Learning', category: 'Data / AI', aliases: ['deep learning', 'neural networks', 'ann', 'cnn'] },
  { name: 'NLP', category: 'Data / AI', aliases: ['nlp', 'natural language processing', 'spacy', 'nltk'] },
  { name: 'TensorFlow', category: 'Data / AI', aliases: ['tensorflow', 'tf', 'keras'] },
  { name: 'PyTorch', category: 'Data / AI', aliases: ['pytorch', 'torch'] },
  { name: 'Pandas', category: 'Data / AI', aliases: ['pandas'] },
  { name: 'NumPy', category: 'Data / AI', aliases: ['numpy'] },
  { name: 'Computer Vision', category: 'Data / AI', aliases: ['computer vision', 'opencv', 'cv'] },
  { name: 'Data Analysis', category: 'Data / AI', aliases: ['data analysis', 'data analytics', 'tableau', 'power bi'] },

  // Mobile
  { name: 'React Native', category: 'Mobile', aliases: ['react native', 'react-native'] },
  { name: 'Flutter', category: 'Mobile', aliases: ['flutter'] },
  { name: 'Android Development', category: 'Mobile', aliases: ['android', 'android studio', 'android sdk'] },
  { name: 'iOS Development', category: 'Mobile', aliases: ['ios', 'xcode'] },

  // Testing & Tools
  { name: 'Jest', category: 'Testing & Tools', aliases: ['jest'] },
  { name: 'Cypress', category: 'Testing & Tools', aliases: ['cypress'] },
  { name: 'Postman', category: 'Testing & Tools', aliases: ['postman'] },
  { name: 'Jira', category: 'Testing & Tools', aliases: ['jira', 'agile', 'scrum'] }
];

// Helper to normalize any input skill to its canonical name
function normalizeSkill(rawSkill) {
  if (!rawSkill || typeof rawSkill !== 'string') return null;
  const clean = rawSkill.trim().toLowerCase();

  for (const item of SKILL_DICTIONARY) {
    if (item.name.toLowerCase() === clean) {
      return item.name;
    }
    for (const alias of item.aliases) {
      if (alias.toLowerCase() === clean) {
        return item.name;
      }
    }
  }

  // If not in dictionary, return capitalized trim version
  return rawSkill.trim();
}

// Map of alias to canonical name for fast lookup
const ALIAS_MAP = new Map();
SKILL_DICTIONARY.forEach(item => {
  ALIAS_MAP.set(item.name.toLowerCase(), item.name);
  item.aliases.forEach(alias => {
    ALIAS_MAP.set(alias.toLowerCase(), item.name);
  });
});

module.exports = {
  SKILL_DICTIONARY,
  normalizeSkill,
  ALIAS_MAP
};
