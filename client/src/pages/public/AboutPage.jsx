import React from 'react';
import { ShieldCheck, Cpu, Database, CheckCircle2, Sparkles, FileCode, Layers, Code2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
          BE Computer Science & Engineering Project
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Recruitment Intelligence Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
          SmartHire replaces unexplainable black-box systems with a deterministic, locally executable matching framework designed for explainability, accuracy, and clear academic viva evaluation.
        </p>
      </div>

      {/* Matching Formula In-Depth */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Deterministic Scoring Engine</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Implemented locally in server/services/matchingService.js</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 dark:bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto border border-slate-800">
          <code>
            overallScore = (skillScore × 0.60) + (experienceScore × 0.20) + (educationScore × 0.10) + (certificationScore × 0.10)
          </code>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              1. Skill Score (60% Weight)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Computed as the intersection of candidate skills (profile + extracted resume) with job required skills:
              <br />
              <code className="text-indigo-600 dark:text-indigo-400 font-mono font-bold mt-1 inline-block">
                (matchedSkills / requiredSkills) × 100
              </code>
              <br />
              Matched preferred skills provide an additional bonus of up to 10 points.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              2. Experience Score (20% Weight)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              If candidate experience meets or exceeds required years, 100% is awarded. Otherwise, proportional credit is assigned:
              <br />
              <code className="text-indigo-600 dark:text-indigo-400 font-mono font-bold mt-1 inline-block">
                (candidateYears / requiredYears) × 100
              </code>
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              3. Education Match (10% Weight)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Evaluates degree tier equivalence: Ph.D., Master's (M.Tech/MCA/MS), and Bachelor's (B.Tech/BE/BCA) against specified job requirements.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
              4. Certification Bonus (10% Weight)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Awards points based on verified credentials (e.g. AWS Certified, Oracle Java, Docker Associate) and domain keyword overlaps.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
            M
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">MongoDB & Mongoose</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Indexed collections for Users, Jobs, Applications, Resumes, and Interviews. Compound unique indexing prevents duplicate applications.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black">
            E+N
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">Express.js & Node.js</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            RESTful API architecture, JWT authentication, Multer file upload with local PDF/DOCX parsing, and centralized error handling.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
            R
          </div>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm">React 18 & Tailwind CSS</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Vite fast bundling, Lucide icons, full dark/light theme persistence, interactive Recharts telemetry, and explainable match modals.
          </p>
        </div>
      </div>
    </div>
  );
}
