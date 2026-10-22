require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');

const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const Skill = require('../models/Skill');
const Assessment = require('../models/Assessment');

const { seedSkills, seedUsers, seedCompanies, seedJobs } = require('./seedData');
const { seedAssessments } = require('./assessmentData');
const { calculateJobMatch } = require('../services/matchingService');

async function runSeed() {
  try {
    await connectDB();
    console.log('\n[Seeder] Clearing existing database collections...');

    await Promise.all([
      User.deleteMany(),
      Company.deleteMany(),
      Job.deleteMany(),
      Resume.deleteMany(),
      Application.deleteMany(),
      Interview.deleteMany(),
      Notification.deleteMany(),
      Skill.deleteMany(),
      Assessment.deleteMany()
    ]);

    console.log('[Seeder] Database cleared.');

    // 1. Seed Skills
    console.log('[Seeder] Seeding Skill dictionary...');
    await Skill.insertMany(seedSkills);
    console.log(`[Seeder] Inserted ${seedSkills.length} canonical skills.`);

    console.log('[Seeder] Seeding skill assessments...');
    await Assessment.insertMany(seedAssessments);
    console.log(`[Seeder] Inserted ${seedAssessments.length} assessments.`);

    // 2. Seed Users
    console.log('[Seeder] Seeding Users...');
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`[Seeder] Created ${createdUsers.length} users.`);

    const admin = createdUsers.find(u => u.role === 'admin');
    const employers = createdUsers.filter(u => u.role === 'employer');
    const candidates = createdUsers.filter(u => u.role === 'candidate');

    // 3. Seed Companies and link to employers
    console.log('[Seeder] Seeding Companies...');
    const createdCompanies = [];
    for (let i = 0; i < seedCompanies.length; i++) {
      const companyData = seedCompanies[i];
      // Assign an employer (cycle through available employers)
      const assignedEmployer = employers[i % employers.length];
      const company = await Company.create({
        ...companyData,
        employer: assignedEmployer._id
      });
      createdCompanies.push(company);

      // Link company to employer if not already set
      if (!assignedEmployer.company) {
        assignedEmployer.company = company._id;
        await assignedEmployer.save();
      }
    }
    console.log(`[Seeder] Created ${createdCompanies.length} companies.`);

    // 4. Seed Resumes for candidates
    console.log('[Seeder] Seeding candidate resumes and parsed texts...');
    for (const candidate of candidates) {
      const resumeText = `RESUME: ${candidate.name}
Email: ${candidate.email} | Phone: ${candidate.phone} | Location: ${candidate.location}
Headline: ${candidate.headline}

SUMMARY:
${candidate.bio}

SKILLS & COMPETENCIES:
${candidate.skills.join(', ')}

PROFESSIONAL EXPERIENCE:
${candidate.experience.map(e => `${e.title} at ${e.company} (${e.years} yrs)\n- ${e.description}`).join('\n')}

EDUCATION:
${candidate.education.map(ed => `${ed.degree}, ${ed.institution} (${ed.grade})`).join('\n')}

CERTIFICATIONS:
${candidate.certifications.map(c => c.name).join(', ') || 'None'}`;

      const resume = await Resume.create({
        candidate: candidate._id,
        originalFilename: `${candidate.name.replace(/\s+/g, '_')}_Resume.pdf`,
        filename: `resume-seed-${candidate._id}.pdf`,
        path: `uploads/resume-seed-${candidate._id}.pdf`,
        fileType: 'pdf',
        fileSize: 145000,
        extractedText: resumeText,
        extractedSkills: candidate.skills,
        parsedDetails: {
          experienceYears: candidate.totalExperienceYears,
          degreeHints: candidate.education.map(e => e.degree),
          contactEmail: candidate.email,
          contactPhone: candidate.phone
        }
      });

      candidate.resume = resume._id;
      await candidate.save();
    }
    console.log(`[Seeder] Seeded ${candidates.length} candidate resumes.`);

    // 5. Seed Jobs
    console.log('[Seeder] Seeding Jobs...');
    const createdJobs = [];
    for (let i = 0; i < seedJobs.length; i++) {
      const jobData = seedJobs[i];
      const company = createdCompanies[i % createdCompanies.length];
      const job = await Job.create({
        ...jobData,
        company: company._id,
        employer: company.employer,
        deadline: new Date(Date.now() + (20 + i * 2) * 24 * 60 * 60 * 1000) // 20-40 days out
      });
      createdJobs.push(job);
    }
    console.log(`[Seeder] Created ${createdJobs.length} active jobs.`);

    // 6. Seed Applications with realistic calculated match scores
    console.log('[Seeder] Creating realistic applications with live match scores...');

    const applicationPairs = [
      // Rahul Sharma (MERN Expert) -> Senior MERN Stack (High match ~90%+)
      { candidate: candidates[0], job: createdJobs[0], status: 'Shortlisted', note: 'Excited about the role, have 3.5 yrs hands-on MERN production experience.' },
      // Priya Patel (Frontend Specialist) -> Frontend React (High match ~90%+)
      { candidate: candidates[1], job: createdJobs[1], status: 'Under Review', note: 'Extensive experience in React, Next.js, and design systems.' },
      // Arun Kumar (DevOps/Backend) -> Backend Node & DevOps (High match ~90%+)
      { candidate: candidates[2], job: createdJobs[2], status: 'Interview Scheduled', note: 'Specialized in microservice architecture and Docker/AWS.' },
      // Rahul Sharma -> Frontend React Specialist (Good match ~75-80%)
      { candidate: candidates[0], job: createdJobs[1], status: 'Applied', note: 'Keen to expand frontend architectural capabilities.' },
      // Vikram Verma (Fresher) -> Associate Web Developer (Good match for freshers ~85%)
      { candidate: candidates[4], job: createdJobs[4], status: 'Under Review', note: 'Recent graduate eager to work hard and contribute.' },
      // Vikram Verma (Fresher) -> Senior MERN Stack (Low match ~35-45% demonstration case)
      { candidate: candidates[4], job: createdJobs[0], status: 'Rejected', note: 'Interested in learning senior responsibilities.' },
      // Ananya Singh (ML) -> ML & NLP Engineer (High match ~92%)
      { candidate: candidates[3], job: createdJobs[3], status: 'Shortlisted', note: 'M.Tech from IIT Delhi in Data Science with research publications.' },
      // Neha Gupta (Java) -> Java & Spring Boot (High match ~94%)
      { candidate: candidates[5], job: createdJobs[5], status: 'Applied', note: '5 years developing high-throughput Spring Boot microservices.' }
    ];

    const createdApplications = [];
    for (const pair of applicationPairs) {
      const match = calculateJobMatch(pair.candidate, pair.job);

      const app = await Application.create({
        candidate: pair.candidate._id,
        job: pair.job._id,
        company: pair.job.company,
        employer: pair.job.employer,
        resume: pair.candidate.resume,
        matchScore: match.score,
        scoreBreakdown: {
          skillScore: match.skillScore,
          experienceScore: match.experienceScore,
          educationScore: match.educationScore,
          certificationScore: match.certificationScore
        },
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        preferredSkillsMatched: match.preferredSkillsMatched,
        experienceMatch: match.experienceMatch,
        educationMatch: match.educationMatch,
        status: pair.status,
        statusHistory: [
          { status: 'Applied', date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), notes: 'Application submitted', updatedBy: pair.candidate._id },
          ...(pair.status !== 'Applied' ? [{ status: pair.status, date: new Date(), notes: `Status advanced to ${pair.status}`, updatedBy: pair.job.employer }] : [])
        ],
        coverNote: pair.note
      });

      await Job.findByIdAndUpdate(pair.job._id, { $inc: { applicantsCount: 1 } });
      createdApplications.push(app);
    }
    console.log(`[Seeder] Created ${createdApplications.length} sample applications.`);

    // 7. Seed sample scheduled interview
    const interviewApp = createdApplications.find(a => a.status === 'Interview Scheduled');
    if (interviewApp) {
      const interviewDate = new Date();
      interviewDate.setDate(interviewDate.getDate() + 3); // 3 days from now
      interviewDate.setHours(14, 30, 0, 0); // 2:30 PM

      await Interview.create({
        application: interviewApp._id,
        candidate: interviewApp.candidate,
        employer: interviewApp.employer,
        job: interviewApp.job,
        company: interviewApp.company,
        date: interviewDate,
        time: '02:30 PM IST',
        interviewType: 'Online',
        meetingLink: 'https://meet.google.com/abc-smarthire-demo',
        notes: 'Technical round focusing on system design, Node.js asynchronous patterns, and Docker deployments.',
        status: 'Scheduled'
      });
      console.log('[Seeder] Created 1 sample scheduled interview.');
    }

    // 8. Seed sample notifications
    console.log('[Seeder] Seeding initial notifications...');
    await Notification.create([
      {
        recipient: candidates[0]._id,
        type: 'status_change',
        title: 'Application Shortlisted!',
        message: 'Congratulations! Your application for Senior MERN Stack Developer has been shortlisted by TechCorp Solutions.',
        link: '/candidate/applications',
        isRead: false
      },
      {
        recipient: candidates[2]._id,
        type: 'interview',
        title: 'Technical Interview Scheduled',
        message: 'FinTech Plus has invited you for a technical interview on your Backend Engineer application.',
        link: '/candidate/interviews',
        isRead: false
      },
      {
        recipient: employers[0]._id,
        type: 'application',
        title: 'High-Match Candidate Applied',
        message: 'Rahul Sharma (95% match) applied for Senior MERN Stack Developer.',
        link: '/employer/jobs',
        isRead: false
      }
    ]);

    console.log('\n======================================================');
    console.log('       SMARTHIRE SEEDING COMPLETED SUCCESSFULLY       ');
    console.log('======================================================');
    console.log('\n[Demo Accounts Created]:');
    console.log('1. Admin:');
    console.log('   Email: admin@smarthire.com | Password: Admin@123\n');
    console.log('2. Employers:');
    console.log('   Email: hr@techcorp.com      | Password: Employer@123 (TechCorp Solutions)');
    console.log('   Email: recruiter@innovate.io | Password: Employer@123 (Innovate Labs)');
    console.log('   Email: talent@fintechplus.com| Password: Employer@123 (FinTech Plus)\n');
    console.log('3. Candidates:');
    console.log('   Email: rahul.sharma@example.com | Password: Candidate@123 (MERN 95% Match)');
    console.log('   Email: priya.patel@example.com  | Password: Candidate@123 (Frontend 95% Match)');
    console.log('   Email: arun.kumar@example.com   | Password: Candidate@123 (Backend 92% Match)');
    console.log('   Email: vikram.verma@example.com | Password: Candidate@123 (Fresher 40%-85% Match)');
    console.log('======================================================\n');

    process.exit(0);
  } catch (err) {
    console.error('[Seeder Error]:', err);
    process.exit(1);
  }
}

runSeed();
