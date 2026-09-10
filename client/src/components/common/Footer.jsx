import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, ShieldCheck, Sparkles, Code2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900">
                Smart<span className="text-indigo-600">Hire</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Deterministic, explainable recruitment matchmaking powered by local text extraction and skills taxonomy comparison.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Deterministic Engine</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              For Job Seekers
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/jobs" className="hover:text-indigo-600 transition">Explore Jobs</Link></li>
              <li><Link to="/candidate/resume" className="hover:text-indigo-600 transition">Upload Resume</Link></li>
              <li><Link to="/candidate/skill-gap" className="hover:text-indigo-600 transition">Skill Gap Analysis</Link></li>
              <li><Link to="/candidate/recommendations" className="hover:text-indigo-600 transition">AI Recommendations</Link></li>
            </ul>
          </div>

          {/* Recruiter Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              For Recruiters
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link to="/employer/jobs/create" className="hover:text-indigo-600 transition">Post a Job</Link></li>
              <li><Link to="/employer/jobs" className="hover:text-indigo-600 transition">Manage Openings</Link></li>
              <li><Link to="/employer/analytics" className="hover:text-indigo-600 transition">Candidate Ranking</Link></li>
              <li><Link to="/employer/interviews" className="hover:text-indigo-600 transition">Schedule Interviews</Link></li>
            </ul>
          </div>

          {/* Architecture & Viva */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Project Architecture
            </h4>
            <p className="text-xs text-slate-500 mb-2 leading-relaxed">
              MERN Stack project (MongoDB, Express, React, Node.js) with zero external AI API dependency.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Code2 className="w-4 h-4 text-indigo-500" />
              <span>BE CSE Final Year Showcase</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} SmartHire Recruitment Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-600">Architecture Specs</Link>
            <Link to="/jobs" className="hover:text-slate-600">Public Job Board</Link>
            <Link to="/login" className="hover:text-slate-600">Demo Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
