import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Sparkles, MapPin, Briefcase, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function RecommendedJobsPage() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/matching/recommendations');
      if (res.data.success) {
        setRecommendations(res.data.data.recommendations || []);
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Computing match scores across active openings..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Recommended Opportunities
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
            Ranked by Match Score
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Open active jobs sorted from highest to lowest compatibility using your skills and experience.
        </p>
      </div>

      {recommendations.length === 0 ? (
        <EmptyState
          title="No recommendations found"
          description="Make sure you have uploaded your resume or added skills to your candidate profile."
          actionText="Upload Resume"
          onAction={() => window.location.href = '/candidate/resume'}
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => {
            const { job, matchScore, skillScore, experienceScore, matchedSkills, missingSkills, isApplied } = rec;

            return (
              <div
                key={job._id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-base">{job.title}</h3>
                      <MatchScoreBadge score={matchScore} size="sm" />
                      {isApplied && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          Applied
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{job.company?.name}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location} ({job.workMode})
                      </span>
                    </p>
                  </div>

                  <Link
                    to={`/jobs/${job._id}`}
                    className="self-start md:self-auto px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{isApplied ? 'View Application' : 'Inspect Match & Apply'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Score Factor Mini Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                  <div>Skills Match: <span className="font-bold text-slate-900">{skillScore}%</span></div>
                  <div>Experience Match: <span className="font-bold text-slate-900">{experienceScore}%</span></div>
                  <div>Job Type: <span className="font-bold text-slate-900">{job.jobType}</span></div>
                  <div>Min Exp: <span className="font-bold text-slate-900">{job.requiredExperience} yrs</span></div>
                </div>

                {/* Skills intersection preview */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs pt-1">
                  <div className="flex-1">
                    <span className="text-[11px] font-bold uppercase text-emerald-700 block mb-1">
                      Matched Skills ({matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matchedSkills.map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {missingSkills.length > 0 && (
                    <div className="flex-1">
                      <span className="text-[11px] font-bold uppercase text-rose-700 block mb-1">
                        Missing Skills ({missingSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {missingSkills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[11px] font-medium">
                            ✗ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
