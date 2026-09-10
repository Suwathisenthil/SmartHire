import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Building2, Check, X, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/companies');
      if (res.data.success) {
        setCompanies(res.data.data.companies || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (companyId, newStatus) => {
    try {
      const res = await api.put(`/admin/companies/${companyId}/status`, {
        status: newStatus
      });
      if (res.data.success) {
        setCompanies(prev =>
          prev.map(c => (c._id === companyId ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      alert(err.message || 'Status update failed');
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading registered companies..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Company Organization Moderation
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Approve or reject employer company profiles across the platform.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Company Name</th>
                <th className="py-3.5 px-4">Recruiter Account</th>
                <th className="py-3.5 px-4">Industry & Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {companies.map((c) => (
                <tr key={c._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                    {c.website && (
                      <a href={c.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1 text-[11px]">
                        <span>{c.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <p className="font-semibold text-slate-800">{c.employer?.name}</p>
                    <p className="text-[11px] text-slate-400">{c.employer?.email}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <p>{c.industry}</p>
                    <p className="text-[11px] text-slate-400">{c.location} ({c.size} size)</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${c.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right space-x-2">
                    {c.status !== 'Approved' && (
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'Approved')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold"
                      >
                        Approve
                      </button>
                    )}
                    {c.status !== 'Rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(c._id, 'Rejected')}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-[11px] font-semibold"
                      >
                        Reject
                      </button>
                    )}
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
