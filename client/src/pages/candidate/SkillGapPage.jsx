import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Layers, Sparkles, TrendingUp, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import SkillGapChart from '../../components/matching/SkillGapChart';
import SkillChip from '../../components/common/SkillChip';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SkillGapPage() {
  const [gapData, setGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillGap();
  }, []);

  const fetchSkillGap = async () => {
    try {
      setLoading(true);
      const res = await api.get('/matching/skill-gap');
      if (res.data.success) {
        setGapData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching skill gap data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Analyzing skills against active market openings..." />;

  const { currentSkills = [], recommendedSkillsToLearn = [], totalJobsAnalyzed = 0 } = gapData || {};

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Skill Gap Analysis & Market Demand
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            Rule-Based Market Analysis
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Analyzed against {totalJobsAnalyzed} currently active jobs in the recruitment marketplace.
        </p>
      </div>

      {/* Verified Current Skills Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Your Verified Current Skills ({currentSkills.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-medium">Ready for matching</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {currentSkills.map((skill, idx) => (
            <SkillChip key={idx} skill={skill} variant="matched" />
          ))}
        </div>
      </div>

      {/* Recharts Market Demand Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Highest In-Demand Missing Skills</span>
            </h3>
            <p className="text-xs text-slate-500">
              Skills frequently required in jobs that you do not yet have listed in your profile
            </p>
          </div>
        </div>

        <SkillGapChart skillsData={recommendedSkillsToLearn} />
      </div>

      {/* Recommended Learning Priorities */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>Recommended Learning Priorities</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedSkillsToLearn.slice(0, 6).map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">{item.skill}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                  Rank #{idx + 1}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Required by <strong className="text-slate-800">{item.demandPercentage}%</strong> of active marketplace jobs ({item.demandCount} jobs).
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full"
                  style={{ width: `${Math.min(item.demandPercentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
