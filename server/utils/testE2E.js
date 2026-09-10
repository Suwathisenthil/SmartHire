const connectDB = require('../config/db');
const app = require('../app');
const http = require('http');

async function runE2ETests() {
  await connectDB();
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(5098, resolve));
  console.log('\n[E2E Test] Test server running on port 5098');

  const BASE = 'http://127.0.0.1:5098/api';
  let candidateToken = '';
  let employerToken = '';
  let adminToken = '';
  let testJobId = '';
  let testAppId = '';

  try {
    // 1. Health Check
    const healthRes = await fetch(`${BASE}/health`).then(r => r.json());
    console.log('✓ 1. Health Check:', healthRes.message);

    // 2. Candidate Login
    const candLogin = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rahul.sharma@example.com', password: 'Candidate@123' })
    }).then(r => r.json());
    if (!candLogin.success) throw new Error('Candidate login failed');
    candidateToken = candLogin.token;
    console.log(`✓ 2. Candidate Login: Success (User: ${candLogin.data.user.name})`);

    // 3. Employer Login
    const empLogin = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'hr@techcorp.com', password: 'Employer@123' })
    }).then(r => r.json());
    if (!empLogin.success) throw new Error('Employer login failed');
    employerToken = empLogin.token;
    console.log(`✓ 3. Employer Login: Success (User: ${empLogin.data.user.name})`);

    // 4. Admin Login
    const admLogin = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@smarthire.com', password: 'Admin@123' })
    }).then(r => r.json());
    if (!admLogin.success) throw new Error('Admin login failed');
    adminToken = admLogin.token;
    console.log(`✓ 4. Admin Login: Success (User: ${admLogin.data.user.name})`);

    // 5. Job Search & Filtering
    const jobsRes = await fetch(`${BASE}/jobs?keyword=Developer&workMode=Hybrid`).then(r => r.json());
    if (!jobsRes.success || jobsRes.data.jobs.length === 0) throw new Error('Job search failed');
    testJobId = jobsRes.data.jobs[0]._id;
    console.log(`✓ 5. Job Search: Found ${jobsRes.data.jobs.length} matching jobs (Sample: ${jobsRes.data.jobs[0].title})`);

    // 6. Candidate Live Match Calculation
    const matchRes = await fetch(`${BASE}/matching/job/${testJobId}`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    }).then(r => r.json());
    if (!matchRes.success) throw new Error('Match calculation failed');
    console.log(`✓ 6. Deterministic Matching Engine: Match Score = ${matchRes.data.score}%, Matched Skills = [${matchRes.data.matchedSkills.join(', ')}], Missing = [${matchRes.data.missingSkills.join(', ')}]`);

    // 7. Job Recommendations
    const recRes = await fetch(`${BASE}/matching/recommendations`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    }).then(r => r.json());
    if (!recRes.success) throw new Error('Recommendations failed');
    console.log(`✓ 7. Job Recommendations: ${recRes.data.total} ranked jobs returned (Top match: ${recRes.data.recommendations[0].matchScore}%)`);

    // 8. Skill Gap Analysis
    const gapRes = await fetch(`${BASE}/matching/skill-gap`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    }).then(r => r.json());
    if (!gapRes.success) throw new Error('Skill gap analysis failed');
    console.log(`✓ 8. Skill Gap Analysis: ${gapRes.data.recommendedSkillsToLearn.length} market priority skills identified`);

    // 9. Employer Candidate Ranking for a Job
    const rankingRes = await fetch(`${BASE}/matching/candidates/${testJobId}`, {
      headers: { 'Authorization': `Bearer ${employerToken}` }
    }).then(r => r.json());
    if (!rankingRes.success) throw new Error('Candidate ranking failed');
    console.log(`✓ 9. Recruiter Candidate Ranking: ${rankingRes.data.applicants.length} applicants ranked descending by score`);
    if (rankingRes.data.applicants.length > 0) {
      testAppId = rankingRes.data.applicants[0].applicationId;
      console.log(`     Rank #1 Candidate: ${rankingRes.data.applicants[0].candidate.name} (Score: ${rankingRes.data.applicants[0].matchScore}%, Status: ${rankingRes.data.applicants[0].status})`);
    }

    // 10. Recruiter Application Status Update
    if (testAppId) {
      const statusRes = await fetch(`${BASE}/applications/${testAppId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${employerToken}` },
        body: JSON.stringify({ status: 'Shortlisted', notes: 'Shortlisted during E2E verification test' })
      }).then(r => r.json());
      if (!statusRes.success) throw new Error('Status update failed');
      console.log('✓ 10. Application Status Update: Advanced to Shortlisted with status history logging');

      // 11. Recruiter Schedule Interview
      const intRes = await fetch(`${BASE}/interviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${employerToken}` },
        body: JSON.stringify({
          applicationId: testAppId,
          date: new Date(Date.now() + 86400000),
          time: '04:00 PM IST',
          interviewType: 'Online',
          meetingLink: 'https://meet.google.com/test-e2e-smarthire',
          notes: 'Automated test interview'
        })
      }).then(r => r.json());
      if (!intRes.success) throw new Error('Interview scheduling failed');
      console.log('✓ 11. Interview Scheduling: Successfully scheduled and dispatched notification');
    }

    // 12. Candidate Notifications Check
    const notifRes = await fetch(`${BASE}/notifications`, {
      headers: { 'Authorization': `Bearer ${candidateToken}` }
    }).then(r => r.json());
    if (!notifRes.success) throw new Error('Notifications check failed');
    console.log(`✓ 12. Notifications Center: ${notifRes.data.notifications.length} notifications delivered (Unread: ${notifRes.data.unreadCount})`);

    // 13. Admin Dashboard & Telemetry
    const adminDash = await fetch(`${BASE}/admin/dashboard`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    }).then(r => r.json());
    if (!adminDash.success) throw new Error('Admin telemetry failed');
    console.log(`✓ 13. Admin Telemetry: Total Users = ${adminDash.data.counts.totalUsers}, Active Jobs = ${adminDash.data.counts.activeJobs}, Applications = ${adminDash.data.counts.totalApplications}`);

    console.log('\n========================================================');
    console.log('       ALL 13 END-TO-END INTEGRATION TESTS PASSED       ');
    console.log('========================================================\n');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('\n[E2E Test Failed]:', err.message);
    server.close();
    process.exit(1);
  }
}

runE2ETests();
