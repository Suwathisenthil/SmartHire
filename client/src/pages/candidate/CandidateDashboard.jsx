import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Send,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { STATUS_COLORS } from '../../utils/constants';

export default function CandidateDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [appsRes, recRes, intRes, gapRes] = await Promise.allSettled([
          api.get('/applications/my'),
          api.get('/matching/recommendations'),
          api.get('/interviews'),
          api.get('/matching/skill-gap')
        ]);

        if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
          setApplications(appsRes.value.data.data.applications || []);
        }
        if (recRes.status === 'fulfilled' && recRes.value.data.success) {
          setRecommendations(recRes.value.data.data.recommendations?.slice(0, 3) || []);
        }
        if (intRes.status === 'fulfilled' && intRes.value.data.success) {
          setInterviews(intRes.value.data.data.interviews || []);
        }
        if (gapRes.status === 'fulfilled' && gapRes.value.data.success) {
          setSkillGap(gapRes.value.data.data);
        }
      } catch (err) {
        console.error('Error loading candidate dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) return <LoadingSpinner fullScreen text="Loading your dashboard..." />;

  // Calculate stats
  const totalApps = applications.length;
  const underReviewCount = applications.filter(a => a.status === 'Under Review' || a.status === 'Applied').length;
  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const avgMatchScore =
    totalApps > 0
      ? Math.round(applications.reduce((acc, curr) => acc + (curr.matchScore || 0), 0) / totalApps)
      : (recommendations[0]?.matchScore || 85);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/60 border border-indigo-500/50 text-indigo-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>Smart Candidate Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            {user?.skills?.length || 0} skills verified. Match engine ready to rank your profile against open job openings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/candidate/resume"
            className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 font-bold text-xs hover:bg-slate-100 transition shadow-sm flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Update Resume</span>
          </Link>
          <Link
            to="/candidate/recommendations"
            className="px-4 py-2.5 rounded-xl bg-indigo-700/80 border border-indigo-500 text-white font-semibold text-xs hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>View Recommendations</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Applications</span>
            <Send className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalApps}</p>
          <p className="text-[11px] text-slate-400">Total submitted</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Review</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{underReviewCount}</p>
          <p className="text-[11px] text-slate-400">Awaiting recruiter feedback</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Shortlisted</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{shortlistedCount}</p>
          <p className="text-[11px] text-slate-400">Advanced to next round</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Avg. Match Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{avgMatchScore}%</p>
          <p className="text-[11px] text-slate-400">Across applied openings</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Top Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Highest Matching Opportunities</span>
            </h2>
            <Link
              to="/candidate/recommendations"
              className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1"
            >
              <span>See all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendations.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-400">
                No job recommendations yet. Upload your resume or add skills in your profile!
              </div>
            ) : (
              recommendations.map((rec) => (
                <div
                  key={rec.job._id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-slate-900 text-sm">{rec.job.title}</h3>
                      <MatchScoreBadge score={rec.matchScore} size="sm" />
                    </div>
                    <p className="text-xs text-slate-500">
                      {rec.job.company?.name} • {rec.job.location} ({rec.job.workMode})
                    </p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {rec.matchedSkills?.slice(0, 4).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                          ✓ {s}
                        </span>
                      ))}
                      {rec.missingSkills?.slice(0, 2).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-medium">
                          ✗ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={`/jobs/${rec.job._id}`}
                    className="self-start sm:self-center px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex-shrink-0"
                  >
                    View Details →
                  </Link>
                </div>
              ))
            )}
          </div>

          {/* Active Applications Recent List */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
              <Link to="/candidate/applications" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all ({applications.length})
              </Link>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden divide-y divide-slate-100">
              {applications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  You haven't submitted any job applications yet.
                </div>
              ) : (
                applications.slice(0, 4).map((app) => (
                  <div key={app._id} className="p-4 flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{app.job?.title || 'Job Opening'}</p>
                      <p className="text-[11px] text-slate-500">{app.company?.name} • Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <MatchScoreBadge score={app.matchScore} size="sm" />
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[app.status] || 'bg-slate-100'}`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Skill Gap & Scheduled Interviews */}
        <div className="space-y-6">
          {/* Scheduled Interviews Box */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Interviews</span>
              </h3>
              <Link to="/candidate/interviews" className="text-xs font-semibold text-indigo-600 hover:underline">
                View all
              </Link>
            </div>

            {interviews.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No interviews scheduled right now.
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.slice(0, 2).map((int) => (
                  <div key={int._id} className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{int.job?.title}</span>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700 text-[10px] font-semibold">
                        {int.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      {new Date(int.date).toLocaleDateString()} at {int.time}
                    </p>
                    {int.meetingLink && (
                      <a
                        href={int.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        Join Meeting Link →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skill Gap Quick Glance */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Market Skill Gaps</span>
              </h3>
              <Link to="/candidate/skill-gap" className="text-xs font-semibold text-indigo-600 hover:underline">
                Full Analysis
              </Link>
            </div>
            <p className="text-xs text-slate-500">
              High-demand skills frequently required in your domain:
            </p>

            <div className="space-y-2">
              {skillGap?.recommendedSkillsToLearn?.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.skill}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px]">
                    {item.demandPercentage}% of jobs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
