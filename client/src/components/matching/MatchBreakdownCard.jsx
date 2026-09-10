import React from 'react';
import SkillChip from '../common/SkillChip';
import MatchScoreBadge from '../common/MatchScoreBadge';
import { CheckCircle, AlertCircle, Award, GraduationCap, Briefcase, Sparkles } from 'lucide-react';

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
    <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-6">
      {/* Header Match Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900">Deterministic Match Score</h3>
            <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
              Rule-Based
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown: Skills (60%), Experience (20%), Education (10%), Certifications (10%)
          </p>
        </div>
        <MatchScoreBadge score={score} size="lg" />
      </div>

      {/* 4-Factor Weighted Progress Bars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Skills 60% */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Skills (60%)
            </span>
            <span className="font-bold text-slate-900">{skillScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(skillScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {matchedSkills.length} of {matchedSkills.length + missingSkills.length} required matched
          </p>
        </div>

        {/* Experience 20% */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              Experience (20%)
            </span>
            <span className="font-bold text-slate-900">{experienceScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(experienceScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {candidateTotalExperience} yrs vs {jobRequiredExperience} yrs required
          </p>
        </div>

        {/* Education 10% */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              Education (10%)
            </span>
            <span className="font-bold text-slate-900">{educationScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(educationScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            {educationMatch ? 'Degree requirement met' : 'Partial / alternative match'}
          </p>
        </div>

        {/* Certifications 10% */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              Certifications (10%)
            </span>
            <span className="font-bold text-slate-900">{certificationScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(certificationScore, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Relevant credential weight
          </p>
        </div>
      </div>

      {/* Matched vs Missing Skills Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Matched */}
        <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Matched Skills ({matchedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, idx) => (
                <SkillChip key={idx} skill={skill} variant="matched" size="sm" />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No matching skills detected.</span>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
          <div className="flex items-center gap-2 mb-3 text-xs font-bold text-rose-800 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>Missing Required Skills ({missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, idx) => (
                <SkillChip key={idx} skill={skill} variant="missing" size="sm" />
              ))
            ) : (
              <span className="text-xs text-emerald-700 font-medium">
                Awesome! You have all required skills.
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Preferred Skills Bonus if any */}
      {preferredSkillsMatched.length > 0 && (
        <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-purple-900">
              Preferred Skills Bonus Matched:
            </p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
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
