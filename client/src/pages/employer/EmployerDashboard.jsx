import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  BarChart3,
  Building2,
  TrendingUp
} from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [jobsRes, intRes] = await Promise.allSettled([
        api.get('/jobs/my/listings'),
        api.get('/interviews')
      ]);

      if (jobsRes.status === 'fulfilled' && jobsRes.value.data.success) {
        setJobs(jobsRes.value.data.data.jobs || []);
      }
      if (intRes.status === 'fulfilled' && intRes.value.data.success) {
        setInterviews(intRes.value.data.data.interviews || []);
      }
    } catch (err) {
      console.error('Error loading employer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading recruiter dashboard..." />;

  const activeJobs = jobs.filter(j => j.status === 'Active');
  const totalApplicants = jobs.reduce((acc, curr) => acc + (curr.applicantsCount || 0), 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-700/60 border border-indigo-500/50 text-indigo-200 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5 text-indigo-300" />
            <span>Employer Recruiter Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruitment Hub: {user?.company?.name || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-xl">
            Candidate applicants are automatically ranked by deterministic resume match scores.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/employer/jobs/create"
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Openings</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{activeJobs.length}</p>
          <p className="text-[11px] text-slate-400">Published to portal</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Applicants</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalApplicants}</p>
          <p className="text-[11px] text-slate-400">Across active listings</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Interviews Scheduled</span>
            <Calendar className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{interviews.length}</p>
          <p className="text-[11px] text-slate-400">Upcoming candidates</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Ranking Engine</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">Active</p>
          <p className="text-[11px] text-slate-400">60/20/10/10 Rule</p>
        </div>
      </div>

      {/* Active Jobs with Applicant Action Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Manage Job Postings & Candidate Rankings</h2>
            <p className="text-xs text-slate-500">Click on any job to inspect applicant ranking based on resume match scores</p>
          </div>
          <Link to="/employer/jobs" className="text-xs font-semibold text-indigo-600 hover:underline">
            View all ({jobs.length})
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{job.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{job.location} ({job.workMode}) • {job.jobType}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {job.requiredSkills.slice(0, 4).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="font-extrabold text-slate-900 text-sm">{job.applicantsCount || 0}</span>
                  <span className="text-slate-500 ml-1">Applicants</span>
                </div>

                <Link
                  to={`/employer/jobs/${job._id}/applicants`}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rank Applicants →</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
