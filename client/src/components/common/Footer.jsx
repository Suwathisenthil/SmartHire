import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ShieldCheck, Code2, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Cpu className="w-4 h-4 text-indigo-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-slate-900 dark:text-white leading-none">
                  Smart<span className="text-indigo-600 dark:text-indigo-400">Hire</span>
                </span>
                <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  Recruitment Intelligence
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Deterministic, explainable recruitment matchmaking powered by local skill taxonomy comparison and transparent scoring.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Explainable Match Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              For Job Seekers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Explore Jobs</Link></li>
              <li><Link to="/candidate/resume" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Upload Resume</Link></li>
              <li><Link to="/candidate/skill-gap" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Skill Gap Analysis</Link></li>
              <li><Link to="/candidate/recommendations" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Skill Recommendations</Link></li>
            </ul>
          </div>

          {/* Recruiter Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              For Recruiters
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><Link to="/employer/jobs/create" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Post a Job</Link></li>
              <li><Link to="/employer/jobs" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Manage Openings</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Candidate Ranking</Link></li>
              <li><Link to="/employer/interviews" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Schedule Interviews</Link></li>
            </ul>
          </div>

          {/* Architecture & Viva */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Project Architecture
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">
              MERN Stack recruitment platform with local parsing (PDF/DOCX) and deterministic 4-part scoring.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>BE CSE Final Year Showcase</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} SmartHire Recruitment Intelligence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-600 dark:hover:text-slate-300">Architecture Specs</Link>
            <Link to="/jobs" className="hover:text-slate-600 dark:hover:text-slate-300">Public Job Board</Link>
            <Link to="/login" className="hover:text-slate-600 dark:hover:text-slate-300">Demo Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
