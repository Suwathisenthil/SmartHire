import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Briefcase, MapPin } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/jobs');
      if (res.data.success) {
        setJobs(res.data.data.jobs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    try {
      const res = await api.put(`/admin/jobs/${jobId}/status`, { status: newStatus });
      if (res.data.success) {
        setJobs(prev => prev.map(j => (j._id === jobId ? { ...j, status: newStatus } : j)));
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading jobs moderation table..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Platform Job Moderation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review job listings and manage publication statuses across the platform.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Title & Organization</th>
                <th className="py-3.5 px-4">Location & Work Mode</th>
                <th className="py-3.5 px-4">Required Experience</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((j) => (
                <tr key={j._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-sm">{j.title}</p>
                    <p className="text-[11px] text-slate-500">{j.company?.name}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <p>{j.location}</p>
                    <p className="text-[11px] text-slate-400">{j.workMode} ({j.jobType})</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600 font-medium">
                    {j.requiredExperience} years
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${j.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                      {j.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    <select
                      value={j.status}
                      onChange={e => handleUpdateStatus(j._id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl border border-slate-200 text-[11px] font-semibold bg-white text-slate-700"
                    >
                      <option value="Active">Set Active</option>
                      <option value="Closed">Set Closed</option>
                      <option value="Draft">Set Draft</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
