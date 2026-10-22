import React from 'react';
import SkillChip from '../common/SkillChip';
import MatchScoreBadge from '../common/MatchScoreBadge';
import { CheckCircle2, AlertTriangle, Award, GraduationCap, Briefcase, Sparkles, Cpu } from 'lucide-react';

export default function MatchBreakdownCard({ matchData }) {
  if (!matchData) return null;

  const {
    score = 0,
    skillScore = 0,
    experienceScore = 0,
    educationScore = 0,
    certificationScore = 0,
    matchedSkills = [],
    missingSkills = [],
    preferredSkillsMatched = [],
    candidateTotalExperience = 0,
    jobRequiredExperience = 0,
    experienceMatch = false,
    educationMatch = false
  } = matchData;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-6 transition-colors">
      {/* Header Match Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Explainable Recruitment Intelligence</h3>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-extrabold uppercase tracking-wider">
              Deterministic Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transparent breakdown: Skills (60%), Experience (20%), Education (10%), Certifications (10%)
          </p>
        </div>
        <MatchScoreBadge score={score} size="lg" />
      </div>

      {/* 4-Factor Weighted Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skills 60% */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Skills (60%)
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">{skillScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(skillScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {matchedSkills.length} of {matchedSkills.length + missingSkills.length} required matched
          </p>
        </div>

        {/* Experience 20% */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Experience (20%)
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">{experienceScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(experienceScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {candidateTotalExperience} yrs vs {jobRequiredExperience} yrs target
          </p>
        </div>

        {/* Education 10% */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Education (10%)
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">{educationScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(educationScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {educationMatch ? 'Degree criteria verified' : 'Alternative credential match'}
          </p>
        </div>

        {/* Certifications 10% */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Certifications (10%)
            </span>
            <span className="font-extrabold text-slate-900 dark:text-white">{certificationScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-amber-500 dark:bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(certificationScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            Domain certifications & accreditation
          </p>
        </div>
      </div>

      {/* Matched vs Missing Skills Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {/* Matched Skills */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-200 dark:border-emerald-800/60">
          <div className="flex items-center gap-2 mb-3.5 text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Matched Skills ({matchedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, idx) => (
                <SkillChip key={idx} skill={skill} variant="matched" size="sm" />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No matching skills detected.</span>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/25 border border-amber-200 dark:border-amber-800/60">
          <div className="flex items-center gap-2 mb-3.5 text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Missing / Target Skills ({missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, idx) => (
                <SkillChip key={idx} skill={skill} variant="missing" size="sm" />
              ))
            ) : (
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                100% skill match requirement satisfied!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preferred Skills Bonus if any */}
      {preferredSkillsMatched.length > 0 && (
        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/25 border border-purple-200 dark:border-purple-800/60 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-xs font-bold text-purple-900 dark:text-purple-300">
              Preferred Skills Bonus Matched:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {preferredSkillsMatched.map((skill, idx) => (
                <SkillChip key={idx} skill={skill} variant="preferred" size="sm" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
