import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  MapPin,
  Briefcase,
  SlidersHorizontal,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { WORK_MODES, JOB_TYPES } from '../../utils/constants';

export default function PublicJobsPage() {
  const { user, isCandidate } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filter States
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('workMode') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [experience, setExperience] = useState(searchParams.get('experience') || '');
  const [page, setPage] = useState(1);

  // Candidate Live Match Scores Map { [jobId]: score }
  const [candidateMatches, setCandidateMatches] = useState({});

  useEffect(() => {
    fetchJobs();
  }, [page, workMode, jobType, experience]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (location) params.append('location', location);
      if (workMode) params.append('workMode', workMode);
      if (jobType) params.append('jobType', jobType);
      if (experience) params.append('experience', experience);
      params.append('page', page);
      params.append('limit', 8);

      const res = await api.get(`/jobs?${params.toString()}`);
      if (res.data.success) {
        const fetchedJobs = res.data.data.jobs || [];
        setJobs(fetchedJobs);
        setPagination(res.data.data.pagination || { page: 1, totalPages: 1, total: 0 });

        // If candidate logged in, compute match scores for the visible jobs
        if (isCandidate && fetchedJobs.length > 0) {
          fetchCandidateMatches(fetchedJobs);
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidateMatches = async (jobList) => {
    try {
      const matchMap = {};
      await Promise.all(
        jobList.map(async (job) => {
          try {
            const res = await api.get(`/matching/job/${job._id}`);
            if (res.data.success) {
              matchMap[job._id] = res.data.data.score;
            }
          } catch (e) {
            // ignore individual match error
          }
        })
      );
      setCandidateMatches(matchMap);
    } catch (e) {
      console.error('Failed candidate match prefetch:', e);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const clearFilters = () => {
    setKeyword('');
    setLocation('');
    setWorkMode('');
    setJobType('');
    setExperience('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Open Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover verified jobs matching your exact skills and experience
          </p>
        </div>
        {isCandidate && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Live Resume Matching Active</span>
          </div>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by job title, skill, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-4 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or remote..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition"
            >
              Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="py-2.5 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Work Mode */}
          <select
            value={workMode}
            onChange={(e) => { setWorkMode(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All Work Modes</option>
            {WORK_MODES.map(mode => <option key={mode} value={mode}>{mode}</option>)}
          </select>

          {/* Job Type */}
          <select
            value={jobType}
            onChange={(e) => { setJobType(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All Job Types</option>
            {JOB_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          {/* Max Experience */}
          <select
            value={experience}
            onChange={(e) => { setExperience(e.target.value); setPage(1); }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">Any Experience</option>
            <option value="0">Freshers / 0 years</option>
            <option value="2">Up to 2 years</option>
            <option value="4">Up to 4 years</option>
            <option value="6">Up to 6 years</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <LoadingSpinner text="Searching jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No jobs found"
          description="Try broadening your search keyword or clearing the filters."
          actionText="Clear Filters"
          onAction={clearFilters}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Showing {jobs.length} of {pagination.total} openings</span>
            <span>Page {pagination.page} of {pagination.totalPages}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => {
              const matchScore = candidateMatches[job._id];

              return (
                <div
                  key={job._id}
                  className="rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-4 relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-base shadow-xs flex-shrink-0">
                          {job.company?.name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition text-base block line-clamp-1"
                          >
                            {job.title}
                          </Link>
                          <p className="text-xs text-slate-500">{job.company?.name}</p>
                        </div>
                      </div>

                      {/* Live Match Badge for Logged In Candidates */}
                      {isCandidate && typeof matchScore === 'number' && (
                        <MatchScoreBadge score={matchScore} size="sm" />
                      )}
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 5 && (
                        <span className="text-xs text-slate-400 self-center">
                          +{job.requiredSkills.length - 5}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location} ({job.workMode})
                      </span>
                      <span>•</span>
                      <span>Min. {job.requiredExperience} yrs</span>
                    </div>

                    <Link
                      to={`/jobs/${job._id}`}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-medium text-slate-600 px-3">
                {page} / {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
