import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  FileText,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Users,
  Search,
  Building2,
  Target
} from 'lucide-react';
import api from '../../services/api';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import SkillChip from '../../components/common/SkillChip';

export default function LandingPage() {
  const [featuredJobs, setFeaturedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs?limit=4');
        if (res.data.success) {
          setFeaturedJobs(res.data.data.jobs || []);
        }
      } catch (err) {
        console.error('Error fetching landing jobs:', err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-tr from-indigo-200/50 via-purple-200/40 to-blue-200/30 blur-3xl -z-10 rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Smart Recruitment Marketplace with Local Resume Parsing</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Upload your resume.{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Discover your match.
            </span>{' '}
            Find the right opportunity.
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            SmartHire uses an explainable, deterministic rule-based matching engine to evaluate skills, experience, and certifications. Zero black-box AI, 100% transparent recruitment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
            >
              <Search className="w-4 h-4" />
              <span>Explore Open Jobs</span>
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-700 font-semibold border border-slate-200 hover:bg-slate-50 transition shadow-xs"
            >
              <span>Create Free Account</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Live Matching Demo Simulation Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg">
                SH
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">How Matching Works in Real-Time</h3>
                <p className="text-xs text-slate-500">Live demonstration of candidate resume vs job requirement comparison</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MatchScoreBadge score={88} size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Candidate Resume Extract */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700">Extracted from Resume</span>
                <span className="text-[10px] text-indigo-600 font-semibold">Local pdf-parse</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SkillChip skill="React" variant="matched" size="sm" />
                <SkillChip skill="Node.js" variant="matched" size="sm" />
                <SkillChip skill="MongoDB" variant="matched" size="sm" />
                <SkillChip skill="JavaScript" variant="matched" size="sm" />
                <SkillChip skill="Git" variant="neutral" size="sm" />
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Experience: <span className="font-semibold text-slate-800">3.5 Years</span> • Education: <span className="font-semibold text-slate-800">B.Tech (CSE)</span>
              </div>
            </div>

            {/* Job Opening Requirement */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-700">MERN Developer Opening</span>
                <span className="text-[10px] text-slate-500 font-medium">TechCorp Solutions</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <SkillChip skill="React" variant="matched" size="sm" />
                <SkillChip skill="Node.js" variant="matched" size="sm" />
                <SkillChip skill="MongoDB" variant="matched" size="sm" />
                <SkillChip skill="Express.js" variant="missing" size="sm" />
                <SkillChip skill="Docker" variant="missing" size="sm" />
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                Min. Exp: <span className="font-semibold text-slate-800">2 Years</span> • Degree: <span className="font-semibold text-slate-800">Bachelor's in CS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5-Step Workflow */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            End-to-End Recruitment Workflow
          </h2>
          <p className="text-sm text-slate-500">
            From file upload to job interview, everything is seamless, automated, and explainable.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[
            { step: '01', title: 'Upload Resume', desc: 'Candidate uploads PDF or DOCX file. Extracted locally via pdf-parse & mammoth.', icon: FileText },
            { step: '02', title: 'Skill Normalization', desc: 'Centralized canonical skill dictionary maps synonyms (e.g. ReactJS -> React).', icon: Layers },
            { step: '03', title: 'Deterministic Match', desc: '60% Skills + 20% Exp + 10% Edu + 10% Certs computes exact score (0-100%).', icon: Target },
            { step: '04', title: 'Smart Apply', desc: 'Candidate sees match score, missing skills, and applies with 1-click snapshot.', icon: Zap },
            { step: '05', title: 'Rank & Interview', desc: 'Employers see candidate rankings and schedule interviews with Google Meet links.', icon: Users }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-300">{item.step}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Jobs Preview */}
      {featuredJobs.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Opportunities</h2>
              <p className="text-xs text-slate-500 mt-1">Latest curated roles across top engineering teams</p>
            </div>
            <Link
              to="/jobs"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>View all openings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job._id}
                to={`/jobs/${job._id}`}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-4 block group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-sm">
                      {job.company?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-500">{job.company?.name} • {job.location}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {job.workMode}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <span className="text-xs text-slate-400 self-center">
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                  <span>₹{job.salary?.min ? (job.salary.min / 100000).toFixed(1) + 'L' : 'Competitive'} - ₹{job.salary?.max ? (job.salary.max / 100000).toFixed(1) + 'L' : 'Best in class'}</span>
                  <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition flex items-center gap-1">
                    Inspect Match Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 sm:p-14 text-white text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to experience transparent matching?
            </h2>
            <p className="text-sm text-indigo-200 leading-relaxed">
              Create an account or use one of our preloaded demo accounts to test candidate resume parsing, recruiter ranking, and admin moderation live.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-6 py-3.5 rounded-xl bg-white text-indigo-900 font-bold hover:bg-slate-100 transition shadow-md"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-indigo-700/60 border border-indigo-500 text-white font-semibold hover:bg-indigo-700 transition"
            >
              Sign In to Demo Accounts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
