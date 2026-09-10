const { SKILL_DICTIONARY } = require('../services/skillDictionary');

const seedSkills = SKILL_DICTIONARY.map(s => ({
  name: s.name,
  category: s.category,
  aliases: s.aliases,
  demandCount: 0
}));

const seedUsers = [
  // 1. ADMIN
  {
    name: 'Platform Administrator',
    email: 'admin@smarthire.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '+91 9876543210',
    location: 'Bangalore, Karnataka',
    headline: 'Chief System Administrator',
    bio: 'Oversees platform security, recruiter moderation, and placement metrics.',
    isActive: true
  },

  // 2. EMPLOYERS
  {
    name: 'Anjali Verma (TechCorp HR)',
    email: 'hr@techcorp.com',
    password: 'Employer@123',
    role: 'employer',
    phone: '+91 9876543211',
    location: 'Bangalore, Karnataka',
    headline: 'Senior Technical Talent Acquisition Partner',
    bio: 'Recruiting top-tier full-stack engineers and cloud architects.',
    isActive: true
  },
  {
    name: 'Suresh Raina (Innovate Labs)',
    email: 'recruiter@innovate.io',
    password: 'Employer@123',
    role: 'employer',
    phone: '+91 9876543212',
    location: 'Hyderabad, Telangana',
    headline: 'Head of People & Culture',
    bio: 'Building next-generation AI and data science teams.',
    isActive: true
  },
  {
    name: 'Kavita Menon (FinTech Plus)',
    email: 'talent@fintechplus.com',
    password: 'Employer@123',
    role: 'employer',
    phone: '+91 9876543213',
    location: 'Mumbai, Maharashtra',
    headline: 'VP of Talent Acquisition',
    bio: 'Scaling high-frequency trading platforms and modern fintech infrastructure.',
    isActive: true
  },

  // 3. CANDIDATES (Diverse profiles & skills)
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    password: 'Candidate@123',
    role: 'candidate',
    phone: '+91 9811122233',
    location: 'Bangalore, Karnataka',
    headline: 'Senior Full Stack MERN Developer | React & Node.js Specialist',
    bio: 'Passionate developer with 3.5 years of experience building scalable web applications with React, Node.js, Express, and MongoDB.',
    skills: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Git', 'REST API', 'Tailwind CSS', 'Redux'],
    totalExperienceYears: 3.5,
    education: [
      { degree: 'B.Tech in Computer Science', fieldOfStudy: 'CSE', institution: 'VTU Karnataka', startYear: 2018, endYear: 2022, grade: '8.8 CGPA' }
    ],
    experience: [
      { title: 'Full Stack Engineer', company: 'CloudScale Technologies', location: 'Bangalore', startDate: new Date('2022-07-01'), current: true, years: 3.5, description: 'Developed high-concurrency microservices and responsive React portals.' }
    ],
    certifications: [
      { name: 'AWS Certified Cloud Practitioner', issuingOrganization: 'Amazon Web Services', issueDate: new Date('2023-04-15') }
    ],
    isActive: true
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    password: 'Candidate@123',
    role: 'candidate',
    phone: '+91 9822233344',
    location: 'Pune, Maharashtra',
    headline: 'Frontend Engineer | React, TypeScript & Next.js',
    bio: 'Specialized in building pixel-perfect, accessible, and performant user interfaces with TypeScript, Next.js, and Tailwind CSS.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS', 'Redux', 'Jest'],
    totalExperienceYears: 2.5,
    education: [
      { degree: 'B.E in Information Technology', fieldOfStudy: 'IT', institution: 'Pune University', startYear: 2019, endYear: 2023, grade: '8.5 CGPA' }
    ],
    experience: [
      { title: 'Frontend Developer', company: 'PixelForge Studio', location: 'Pune', startDate: new Date('2023-01-10'), current: true, years: 2.5, description: 'Led UI design system and client-side performance audits.' }
    ],
    certifications: [
      { name: 'Meta Certified Frontend Developer', issuingOrganization: 'Meta / Coursera', issueDate: new Date('2023-08-20') }
    ],
    isActive: true
  },
  {
    name: 'Arun Kumar',
    email: 'arun.kumar@example.com',
    password: 'Candidate@123',
    role: 'candidate',
    phone: '+91 9833344455',
    location: 'Chennai, Tamil Nadu',
    headline: 'Backend & Cloud Infrastructure Engineer | Node, Python & Docker',
    bio: 'Backend developer focused on resilient distributed systems, Docker containerization, Kubernetes orchestration, and database optimization.',
    skills: ['Node.js', 'Python', 'Express.js', 'Docker', 'PostgreSQL', 'Redis', 'AWS', 'Linux', 'REST API', 'CI/CD', 'Git'],
    totalExperienceYears: 4,
    education: [
      { degree: 'B.Tech in Computer Science', fieldOfStudy: 'CSE', institution: 'Anna University', startYear: 2017, endYear: 2021, grade: '8.2 CGPA' }
    ],
    experience: [
      { title: 'Backend Software Engineer', company: 'InfraScale Systems', location: 'Chennai', startDate: new Date('2021-06-01'), current: true, years: 4, description: 'Architected API gateways and automated deployment pipelines.' }
    ],
    certifications: [
      { name: 'Docker Certified Associate', issuingOrganization: 'Mirantis', issueDate: new Date('2022-11-10') }
    ],
    isActive: true
  },
  {
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    password: 'Candidate@123',
    role: 'candidate',
    phone: '+91 9844455566',
    location: 'Gurgaon, Haryana',
    headline: 'Data Scientist & ML Engineer | Python, PyTorch & Deep Learning',
    bio: 'Specialized in computer vision, NLP, statistical modeling, and production ML pipelines using PyTorch, TensorFlow, and Pandas.',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Pandas', 'NumPy', 'Data Analysis', 'SQL', 'Git'],
    totalExperienceYears: 3,
    education: [
      { degree: 'M.Tech in Data Science', fieldOfStudy: 'Data Science', institution: 'IIT Delhi', startYear: 2021, endYear: 2023, grade: '9.1 CGPA' },
      { degree: 'B.Tech in Computer Science', fieldOfStudy: 'CSE', institution: 'NIT Kurukshetra', startYear: 2017, endYear: 2021, grade: '8.7 CGPA' }
    ],
    experience: [
      { title: 'Machine Learning Engineer', company: 'NeuralCraft AI', location: 'Gurgaon', startDate: new Date('2023-07-01'), current: true, years: 2, description: 'Built LLM pipelines and fine-tuned BERT/transformer architectures.' }
    ],
    certifications: [
      { name: 'Deep Learning Specialization', issuingOrganization: 'DeepLearning.AI', issueDate: new Date('2022-05-15') }
    ],
    isActive: true
  },
  {
    name: 'Vikram Verma',
    email: 'vikram.verma@example.com',
    password: 'Candidate@123',
    role: 'candidate',
    phone: '+91 9855566677',
    location: 'Noida, Uttar Pradesh',
    headline: 'Junior Web Developer & Computer Science Graduate (2024)',
    bio: 'Recent graduate eager to contribute to dynamic software teams. Strong fundamentals in JavaScript, HTML, CSS, React, and MySQL.',
    skills: ['JavaScript', 'HTML', 'CSS', 'React', 'MySQL', 'Git', 'Bootstrap'],
    totalExperienceYears: 0.5,
    education: [
      { degree: 'B.Tech in Information Technology', fieldOfStudy: 'IT', institution: 'AKTU', startYear: 2020, endYear: 2024, grade: '7.9 CGPA' }
    ],
    experience: [
      { title: 'Web Development Intern', company: 'WebRoots Infotech', location: 'Noida', startDate: new Date('2024-01-15'), endDate: new Date('2024-06-30'), current: false, years: 0.5, description: 'Assisted in building responsive landing pages and bug fixes.' }
    ],
    certifications: [],
    isActive: true
  },
  {
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    password: 'Candidate@123',
    role: 'candidate',
    phone: '+91 9866677788',
    location: 'Hyderabad, Telangana',
    headline: 'Enterprise Java & Spring Boot Developer | Microservices',
    bio: '5 years of enterprise Java development experience designing RESTful APIs, Spring Cloud microservices, and database clustering.',
    skills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'Docker', 'Kubernetes', 'REST API', 'Git', 'AWS'],
    totalExperienceYears: 5,
    education: [
      { degree: 'MCA (Master of Computer Applications)', fieldOfStudy: 'Computer Applications', institution: 'Osmania University', startYear: 2017, endYear: 2020, grade: '8.4 CGPA' }
    ],
    experience: [
      { title: 'Senior Java Developer', company: 'Apex Global Financials', location: 'Hyderabad', startDate: new Date('2020-08-01'), current: true, years: 5, description: 'Maintained core banking ledger services.' }
    ],
    certifications: [
      { name: 'Oracle Certified Professional: Java SE', issuingOrganization: 'Oracle', issueDate: new Date('2021-03-10') }
    ],
    isActive: true
  }
];

const seedCompanies = [
  {
    name: 'TechCorp Solutions',
    industry: 'Information Technology & Cloud Services',
    location: 'Bangalore, Karnataka',
    description: 'A global technology partner delivering digital transformation, enterprise cloud engineering, and high-velocity web platforms.',
    website: 'https://techcorp.example.com',
    size: '201-500',
    status: 'Approved'
  },
  {
    name: 'Innovate Labs',
    industry: 'Artificial Intelligence & Analytics',
    location: 'Hyderabad, Telangana',
    description: 'Pioneering intelligent enterprise platforms using deep learning, natural language processing, and automated decision engines.',
    website: 'https://innovatelabs.example.com',
    size: '51-200',
    status: 'Approved'
  },
  {
    name: 'FinTech Plus',
    industry: 'Financial Technology',
    location: 'Mumbai, Maharashtra',
    description: 'Next-generation payment gateway and algorithmic trading engine providing sub-millisecond transaction speeds.',
    website: 'https://fintechplus.example.com',
    size: '51-200',
    status: 'Approved'
  },
  {
    name: 'CloudNative Systems',
    industry: 'DevOps & Cloud Infrastructure',
    location: 'Chennai, Tamil Nadu',
    description: 'Enabling enterprises to build resilient, auto-scaling Kubernetes platforms and modern GitOps deployment pipelines.',
    website: 'https://cloudnative.example.com',
    size: '11-50',
    status: 'Approved'
  },
  {
    name: 'PixelCraft Digital',
    industry: 'Product Design & Web Engineering',
    location: 'Pune, Maharashtra',
    description: 'Crafting delight through human-centric UI/UX and ultra-fast frontend applications using modern web standards.',
    website: 'https://pixelcraft.example.com',
    size: '11-50',
    status: 'Approved'
  }
];

const seedJobs = [
  // 1. MERN Stack Developer (Ideal match for Rahul Sharma)
  {
    title: 'Senior MERN Stack Developer',
    description: 'We are seeking an experienced MERN Stack Engineer to lead the development of our core SaaS collaboration suite. You will design robust RESTful endpoints, implement reactive frontend components, optimize MongoDB schemas, and collaborate with our DevOps engineers on containerized deployments.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript'],
    preferredSkills: ['Docker', 'AWS', 'Tailwind CSS', 'Redux'],
    requiredExperience: 3,
    education: "Bachelor's Degree in CS, IT or equivalent",
    location: 'Bangalore, Karnataka',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    salary: { min: 1200000, max: 1800000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 2. Frontend React / TypeScript Engineer (Ideal match for Priya Patel)
  {
    title: 'Frontend React & TypeScript Specialist',
    description: 'Join our product experience team to build blazing-fast interactive web applications. You will be responsible for creating reusable design components, managing client state with Redux Toolkit, and architecting Next.js server-rendered pages with clean Tailwind styles.',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'JavaScript', 'HTML'],
    preferredSkills: ['Next.js', 'Redux', 'Jest', 'Git'],
    requiredExperience: 2,
    education: "Bachelor's Degree in Computer Science or related",
    location: 'Pune, Maharashtra',
    workMode: 'Remote',
    jobType: 'Full Time',
    salary: { min: 900000, max: 1400000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 3. Backend & Cloud Infrastructure Engineer (Ideal match for Arun Kumar)
  {
    title: 'Backend Engineer (Node.js & DevOps)',
    description: 'Looking for a seasoned backend engineer with strong cloud fundamentals. You will design fault-tolerant microservices with Node.js and Express, manage PostgreSQL databases with Redis caching, and deploy containerized workloads using Docker and AWS.',
    requiredSkills: ['Node.js', 'Docker', 'PostgreSQL', 'AWS', 'REST API'],
    preferredSkills: ['Kubernetes', 'Redis', 'Python', 'CI/CD'],
    requiredExperience: 3,
    education: "B.Tech/B.E in CSE/IT or relevant experience",
    location: 'Chennai, Tamil Nadu',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    salary: { min: 1400000, max: 2000000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 4. Machine Learning & Data Scientist (Ideal match for Ananya Singh)
  {
    title: 'Machine Learning & NLP Engineer',
    description: 'Build production-ready machine learning models and deep neural networks. You will implement transformer architectures with PyTorch and HuggingFace, clean and manipulate massive tabular data with Pandas/NumPy, and deploy predictive APIs.',
    requiredSkills: ['Python', 'Machine Learning', 'Deep Learning', 'PyTorch', 'Pandas'],
    preferredSkills: ['NLP', 'TensorFlow', 'Docker', 'AWS'],
    requiredExperience: 2,
    education: "Master's Degree or B.Tech in CSE / Data Science",
    location: 'Gurgaon, Haryana',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    salary: { min: 1600000, max: 2400000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 5. Junior / Fresher Web Developer (Ideal match for Vikram Verma)
  {
    title: 'Associate Web Developer (Freshers / 0-1 yr)',
    description: 'Great opportunity for entry-level developers and recent college graduates! You will work alongside senior developers to implement user interface enhancements, fix UI bugs, write clean JavaScript code, and learn full-stack web development on the job.',
    requiredSkills: ['JavaScript', 'HTML', 'CSS', 'React'],
    preferredSkills: ['Git', 'Bootstrap', 'Node.js'],
    requiredExperience: 0,
    education: "B.Tech / BCA / B.Sc in Computer Science (2023 or 2024 passout)",
    location: 'Noida, Uttar Pradesh',
    workMode: 'On-site',
    jobType: 'Full Time',
    salary: { min: 450000, max: 650000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 6. Enterprise Java & Spring Boot Architect (Ideal match for Neha Gupta)
  {
    title: 'Senior Java & Spring Boot Developer',
    description: 'Develop mission-critical transactional banking services. You will design distributed microservices using Spring Boot, handle database transactions with MySQL and Redis, and ensure 99.99% system availability through automated CI/CD pipelines.',
    requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'MySQL', 'REST API'],
    preferredSkills: ['Docker', 'Kubernetes', 'AWS', 'Redis'],
    requiredExperience: 4,
    education: "B.Tech / MCA or equivalent",
    location: 'Hyderabad, Telangana',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    salary: { min: 1500000, max: 2200000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 7. Full Stack Python / Django Developer
  {
    title: 'Full Stack Python & React Developer',
    description: 'Build internal tooling and customer-facing web dashboards. Responsibilities include building Django REST framework backends, integrating React dashboards, and maintaining PostgreSQL databases.',
    requiredSkills: ['Python', 'Django', 'React', 'JavaScript', 'PostgreSQL'],
    preferredSkills: ['Docker', 'AWS', 'Tailwind CSS'],
    requiredExperience: 2,
    education: "Bachelor's Degree in Computer Science",
    location: 'Bangalore, Karnataka',
    workMode: 'Remote',
    jobType: 'Full Time',
    salary: { min: 1000000, max: 1600000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 8. DevOps & Cloud Platform Specialist
  {
    title: 'Cloud DevOps & Site Reliability Engineer',
    description: 'Automate everything! Build infrastructure-as-code with Terraform, configure resilient Kubernetes clusters on AWS/GCP, and create automated CI/CD pipelines using GitHub Actions.',
    requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
    preferredSkills: ['Python', 'Go', 'Git', 'Nginx'],
    requiredExperience: 3,
    education: "Degree in Engineering or Computer Science",
    location: 'Mumbai, Maharashtra',
    workMode: 'Remote',
    jobType: 'Full Time',
    salary: { min: 1600000, max: 2300000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 9. Mobile App Developer (React Native)
  {
    title: 'Mobile Application Developer (React Native)',
    description: 'Create fluid cross-platform mobile apps for iOS and Android. You will write reusable React Native components, integrate RESTful APIs, and handle offline-first caching.',
    requiredSkills: ['React Native', 'React', 'JavaScript', 'REST API'],
    preferredSkills: ['TypeScript', 'Redux', 'iOS Development', 'Android Development'],
    requiredExperience: 2,
    education: "Bachelor's Degree in Computer Science or related",
    location: 'Bangalore, Karnataka',
    workMode: 'Hybrid',
    jobType: 'Full Time',
    salary: { min: 1100000, max: 1700000, currency: 'INR', period: 'per year' },
    status: 'Active'
  },

  // 10. Frontend Engineering Intern
  {
    title: 'Frontend Engineering Intern (Summer 2026)',
    description: '3-month fast-track engineering internship. Work on modern responsive UI widgets with HTML, CSS, JavaScript and React. High chance of full-time conversion based on performance.',
    requiredSkills: ['HTML', 'CSS', 'JavaScript', 'React'],
    preferredSkills: ['Tailwind CSS', 'Git'],
    requiredExperience: 0,
    education: "Pursuing BE/B.Tech in CSE/IT (Final/Pre-final year)",
    location: 'Bangalore, Karnataka',
    workMode: 'Remote',
    jobType: 'Internship',
    salary: { min: 25000, max: 35000, currency: 'INR', period: 'per month' },
    status: 'Active'
  }
];

module.exports = {
  seedSkills,
  seedUsers,
  seedCompanies,
  seedJobs
};
