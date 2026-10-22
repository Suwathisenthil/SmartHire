const q = (question, options, correctAnswer, explanation = '', difficulty = 'Intermediate') => ({ question, options, correctAnswer, explanation, difficulty });

const seedAssessments = [
  {
    skill: 'JavaScript', category: 'Frontend', description: 'Core JavaScript concepts used in modern web applications.', passPercent: 80,
    questions: [
      q('Which keyword creates a block-scoped variable?', ['var', 'let', 'function', 'global'], 1),
      q('What does Array.prototype.map() return?', ['The original array only', 'A new transformed array', 'A boolean', 'An object'], 1),
      q('Which value represents an intentional absence of an object value?', ['undefined', 'null', 'NaN', 'false'], 1),
      q('What is a closure?', ['A CSS rule', 'A function with access to its lexical scope', 'A database connection', 'A loop'], 1),
      q('Which method converts JSON text into a JavaScript value?', ['JSON.parse()', 'JSON.stringify()', 'JSON.object()', 'JSON.convert()'], 0),
      q('What does === check?', ['Only type', 'Only value', 'Value and type', 'Reference only'], 2),
      q('Which Promise state means the operation finished successfully?', ['pending', 'fulfilled', 'rejected', 'cancelled'], 1),
      q('Which operator provides a fallback only for null or undefined?', ['||', '&&', '??', '?.'], 2)
    ]
  },
  {
    skill: 'React', category: 'Frontend', description: 'React fundamentals including components, state, props and hooks.', passPercent: 80,
    questions: [
      q('What is a React component?', ['A database table', 'A reusable UI unit', 'A server process', 'A CSS compiler'], 1),
      q('Which hook stores local component state?', ['useEffect', 'useMemo', 'useState', 'useRefOnly'], 2),
      q('Props are primarily used to:', ['Pass data into components', 'Connect MongoDB', 'Compile CSS', 'Create JWTs'], 0),
      q('Why is a key used when rendering lists?', ['To identify list elements', 'To encrypt data', 'To create routes', 'To call APIs'], 0),
      q('useEffect is commonly used for:', ['Side effects', 'Declaring CSS', 'Database schemas', 'Password hashing'], 0),
      q('Which command commonly starts a Vite React development server?', ['npm run dev', 'npm run database', 'npm run compile-only', 'node react'], 0),
      q('A controlled input gets its value from:', ['React state', 'The browser database', 'MongoDB directly', 'CSS'], 0),
      q('What does conditional rendering mean?', ['Showing UI based on a condition', 'Rendering only CSS', 'Rendering on a server only', 'Disabling JavaScript'], 0)
    ]
  },
  {
    skill: 'Node.js', category: 'Backend', description: 'Node.js fundamentals for building server-side applications.', passPercent: 80,
    questions: [
      q('Node.js is built on which JavaScript engine?', ['V8', 'SpiderMonkey only', 'JVM', 'WebKit'], 0),
      q('Which module is commonly used to create an HTTP server?', ['http', 'path-only', 'css', 'react-dom'], 0),
      q('What is npm?', ['Node package manager', 'A database', 'A browser', 'A CSS framework'], 0),
      q('Which object provides environment variables?', ['process.env', 'window.env', 'node.envOnly', 'global.envFile'], 0),
      q('Express is primarily used to:', ['Build web APIs and servers', 'Design images', 'Compile Java', 'Manage spreadsheets'], 0),
      q('What does middleware usually do in Express?', ['Process requests before the final handler', 'Create MongoDB databases', 'Render hardware', 'Compile React'], 0),
      q('Which status code means resource created successfully?', ['200', '201', '301', '404'], 1),
      q('Why should passwords be hashed?', ['To avoid storing plaintext passwords', 'To make them reversible', 'To improve CSS', 'To remove authentication'], 0)
    ]
  },
  {
    skill: 'Java', category: 'Programming', description: 'Core Java, OOP, collections and exception handling.', passPercent: 80,
    questions: [
      q('Which keyword creates an object in Java?', ['make', 'new', 'create', 'object'], 1),
      q('Which principle hides internal implementation details?', ['Encapsulation', 'Inheritance', 'Compilation', 'Iteration'], 0),
      q('Which collection does not allow duplicate elements?', ['List', 'Set', 'ArrayList', 'Vector'], 1),
      q('Which keyword is used for inheritance between classes?', ['implements', 'extends', 'inherits', 'superclass'], 1),
      q('What is method overloading?', ['Same method name with different parameter lists', 'Replacing a class', 'Deleting methods', 'Changing package names'], 0),
      q('Which block commonly handles an exception?', ['try-catch', 'if-else-only', 'switch-case-only', 'for-finally'], 0),
      q('Which type stores true or false?', ['boolean', 'bit', 'binary', 'logical'], 0),
      q('What does JVM stand for?', ['Java Virtual Machine', 'Java Variable Method', 'Java Verified Module', 'Joint Virtual Memory'], 0)
    ]
  },
  {
    skill: 'Python', category: 'Programming', description: 'Python fundamentals, collections, functions and exceptions.', passPercent: 80,
    questions: [
      q('Which symbol starts a Python comment?', ['//', '#', '<!--', '/*'], 1),
      q('Which collection is ordered and mutable?', ['tuple', 'list', 'set', 'frozenset'], 1),
      q('Which keyword defines a function?', ['func', 'def', 'function', 'lambda-only'], 1),
      q('What does len() return?', ['Number of items/characters', 'Last item', 'Data type', 'Memory address'], 0),
      q('Which type stores key-value pairs?', ['list', 'tuple', 'dict', 'set'], 2),
      q('Which keyword handles exceptions?', ['try', 'catch', 'except-only-without-try', 'error'], 0),
      q('What does == compare?', ['Values for equality', 'Types only', 'Memory only', 'Variable names'], 0),
      q('Which library is commonly used for tabular data analysis?', ['Pandas', 'Flask', 'Express', 'JUnit'], 0)
    ]
  },
  {
    skill: 'SQL', category: 'Database', description: 'SQL querying, joins, aggregation and relational database concepts.', passPercent: 80,
    questions: [
      q('Which command retrieves rows from a table?', ['GET', 'SELECT', 'FETCHTABLE', 'READ'], 1),
      q('Which clause filters rows before grouping?', ['WHERE', 'HAVING', 'ORDER BY', 'GROUP'], 0),
      q('Which clause filters groups after aggregation?', ['WHERE', 'HAVING', 'FILTER GROUP', 'AFTER'], 1),
      q('Which JOIN returns matching rows from both tables?', ['INNER JOIN', 'FULL DELETE', 'CROSS FILTER', 'ONLY JOIN'], 0),
      q('Which function counts rows?', ['SUM()', 'COUNT()', 'TOTAL()', 'ROWS()'], 1),
      q('Which keyword removes duplicate result rows?', ['UNIQUE', 'DISTINCT', 'SINGLE', 'DEDUP'], 1),
      q('A primary key should uniquely identify a:', ['Column group only', 'Row', 'Database server', 'Query'], 1),
      q('Which command changes existing rows?', ['UPDATE', 'ALTERROW', 'CHANGE', 'MODIFYDATA'], 0)
    ]
  }
];

module.exports = { seedAssessments };
