import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Briefcase, Plus, Users, Sparkles, Edit3, Trash2, Power, ArrowRight } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { STATUS_COLORS } from '../../utils/constants';

export default function ManageJobsPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/jobs/my/listings');
      if (res.data.success) {
        setJobs(res.data.data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch employer jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (job) => {
    const newStatus = job.status === 'Active' ? 'Closed' : 'Active';
    try {
      const res = await api.put(`/jobs/${job._id}`, { status: newStatus });
      if (res.data.success) {
        setJobs(prev => prev.map(j => (j._id === job._id ? { ...j, status: newStatus } : j)));
      }
    } catch (err) {
      alert(err.message || 'Failed to update job status');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This cannot be undone.')) return;
    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        setJobs(prev => prev.filter(j => j._id !== jobId));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete job');
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading your listings..." />;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manage Job Postings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor applicant pipelines and inspect candidate rankings powered by resume match scores.
          </p>
        </div>
        <Link
          to="/employer/jobs/create"
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No job postings yet"
          description="Create your first job listing to start receiving and ranking applicants."
          actionText="Create Job"
          onAction={() => navigate('/employer/jobs/create')}
        />
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Job Title & Work Mode</th>
                  <th className="py-3.5 px-4">Required Skills</th>
                  <th className="py-3.5 px-4">Applicants</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Deadline</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4">
                      <Link
                        to={`/jobs/${job._id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition block text-sm"
                      >
                        {job.title}
                      </Link>
                      <span className="text-slate-500 text-[11px]">
                        {job.location} • {job.workMode} ({job.jobType})
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 3).map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                            {s}
                          </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400 self-center">
                            +{job.requiredSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/employer/jobs/${job._id}/applicants`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{job.applicantsCount || 0} Ranked</span>
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(job)}
                        className={`px-2.5 py-0.5 rounded-full font-bold border text-[10px] transition cursor-pointer ${
                          job.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {job.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right space-x-1">
                      <Link
                        to={`/employer/jobs/${job._id}/edit`}
                        className="p-1.5 inline-block text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition"
                        title="Edit Job"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
