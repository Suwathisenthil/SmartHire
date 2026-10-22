import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
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
  Target,
  Cpu,
  BarChart3,
  AlertTriangle,
  Briefcase
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

  const workflowSteps = [
    { step: '01', title: 'RESUME', desc: 'Local PDF & DOCX text extraction' },
    { step: '02', title: 'SKILLS', desc: '100+ taxonomy normalization' },
    { step: '03', title: 'MATCH', desc: 'Multi-factor requirement comparison' },
    { step: '04', title: 'SCORE', desc: 'Deterministic 4-part transparent rating' },
    { step: '05', title: 'SKILL GAPS', desc: 'Precise missing skills & demand radar' },
    { step: '06', title: 'BETTER HIRING', desc: 'Ranked candidate shortlists' }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-blue-500/10 blur-3xl -z-10 rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Recruitment Intelligence Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Hire by skills.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400">
              Not just keywords.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SmartHire analyzes resumes, extracts candidate skills, matches them against job requirements, explains the match, and identifies skill gaps.
          </p>

          {/* Two Strong CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/jobs"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition duration-150"
            >
              <Search className="w-4 h-4" />
              <span>Find Your Match</span>
            </Link>
            <Link
              to="/register?role=employer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 transition shadow-xs"
            >
              <span>Hire Smarter</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* 6-Step Visual Workflow */}
        <div className="mt-16 max-w-5xl mx-auto">
          <p className="text-center text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
            The Deterministic Intelligence Pipeline
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {workflowSteps.map((ws, i) => (
              <div
                key={ws.step}
                className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between group hover:border-indigo-400 dark:hover:border-indigo-600 transition"
              >
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                    {ws.step}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-wide mt-1">
                    {ws.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {ws.desc}
                  </p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Live Matching Demo Showcase Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-extrabold text-lg">
                SH
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Sample Live Match Simulation</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Deterministic candidate resume vs Senior MERN opening</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MatchScoreBadge score={95} size="lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
            {/* Candidate Resume Extract */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Candidate Skill DNA</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Extracted from PDF
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skills normalized via dictionary taxonomy:
              </p>
              <div className="flex flex-wrap gap-2">
                <SkillChip skill="React" variant="matched" size="sm" />
                <SkillChip skill="Node.js" variant="matched" size="sm" />
                <SkillChip skill="MongoDB" variant="matched" size="sm" />
                <SkillChip skill="Express" variant="matched" size="sm" />
                <SkillChip skill="JavaScript" variant="matched" size="sm" />
                <SkillChip skill="REST APIs" variant="matched" size="sm" />
              </div>
            </div>

            {/* Target Job Match Analysis */}
            <div className="p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/25 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                  Senior MERN Developer Match
                </span>
                <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                  95% Overall Fit
                </span>
              </div>

              {/* Matched vs Missing */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-indigo-100/60 dark:border-indigo-900/40">
                  <span className="text-slate-600 dark:text-slate-400">Skill Overlap (60% wt)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">✓ React, Node.js, MongoDB, Express</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-indigo-100/60 dark:border-indigo-900/40">
                  <span className="text-slate-600 dark:text-slate-400">Target Skill Gaps</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> AWS (Cloud)
                  </span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-600 dark:text-slate-400">Relevant Experience (20% wt)</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">4 Years (Exceeds Target)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Active Verified Openings</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore open positions with transparent requirements and real-time skill matching
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <span>View all positions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {featuredJobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{job.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1 font-medium">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{job.company?.name || 'Partner Company'}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                    {job.workMode}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills?.slice(0, 5).map((skill, idx) => (
                    <SkillChip key={idx} skill={skill} size="sm" />
                  ))}
                  {job.requiredSkills?.length > 5 && (
                    <span className="text-[11px] text-slate-400 font-semibold self-center">
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {job.requiredExperience ? `${job.requiredExperience}+ yrs exp` : 'Fresher welcome'}
                </span>
                <Link
                  to={`/jobs/${job._id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition"
                >
                  <span>Evaluate Match</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recruitment Intelligence Story Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 blur-3xl rounded-full" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Transparent & Deterministic</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why Recruiters and Candidates Rely on SmartHire
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Traditional applicant tracking systems discard resumes using opaque filters. SmartHire computes explicit mathematical overlaps across skills, verified experience, and academic tier, providing candidate ranking and actionable missing skill recommendations.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow-sm"
              >
                Create Free Account
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs border border-slate-700 transition"
              >
                Read Matching Specs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
