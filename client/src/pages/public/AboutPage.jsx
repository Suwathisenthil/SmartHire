import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Sparkles, FileCode, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
          BE Computer Science Engineering Project
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          SmartHire Architecture & Matching Engine
        </h1>
        <p className="text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
          SmartHire replaces unexplainable black-box AI with a deterministic, locally executable rule-based matching framework tailored for high accuracy, fairness, and instant viva demonstration.
        </p>
      </div>

      {/* Matching Formula In-Depth */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Deterministic Scoring Formula</h2>
            <p className="text-xs text-slate-500">Implemented in server/services/matchingService.js</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto">
          <code>
            overallScore = (skillScore × 0.60) + (experienceScore × 0.20) + (educationScore × 0.10) + (certificationScore × 0.10)
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-900">1. Skill Score (60% Weight)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculated as the intersection of candidate skills (profile + resume) with job required skills:
              <br />
              <code className="text-indigo-600 font-mono">(matchedSkills / requiredSkills) × 100</code>
              <br />
              Matched preferred skills provide an additional bonus of up to 10 points.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-900">2. Experience Score (20% Weight)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              If candidate experience meets or exceeds required years, 100% is awarded. Otherwise, proportional credit is assigned:
              <br />
              <code className="text-indigo-600 font-mono">(candidateYears / requiredYears) × 100</code>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-900">3. Education Match (10% Weight)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Evaluates degree tier equivalence: Ph.D., Master's (M.Tech/MCA/MS), and Bachelor's (B.Tech/BE/BCA) against specified prerequisites.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="text-xs font-bold uppercase text-slate-900">4. Certification Bonus (10% Weight)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Awards points based on verified credentials (e.g. AWS Certified, Oracle Java, Docker Associate) and domain keyword overlaps.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            M
          </div>
          <h3 className="font-bold text-slate-900 text-sm">MongoDB & Mongoose</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Indexed collections for Users, Jobs, Applications, Resumes, and Interviews. Compound unique indexing prevents duplicate applications.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            E+N
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Express.js & Node.js</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            RESTful API architecture, JWT authentication, Multer file upload with MIME verification, and centralized error handling.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            R
          </div>
          <h3 className="font-bold text-slate-900 text-sm">React & Tailwind CSS</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Vite-powered single page application with Tailwind styling, Recharts dynamic data visualizations, and role-based route guards.
          </p>
        </div>
      </div>
    </div>
  );
}
