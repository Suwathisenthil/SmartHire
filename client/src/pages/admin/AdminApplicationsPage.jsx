import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Send, MapPin } from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { STATUS_COLORS } from '../../utils/constants';

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/applications');
      if (res.data.success) {
        setApplications(res.data.data.applications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading applications telemetry..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System-Wide Applications Telemetry
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Audited log of candidate applications submitted across the recruitment portal.
        </p>
      </div>

      <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Candidate</th>
                <th className="py-3.5 px-4">Target Job Opening</th>
                <th className="py-3.5 px-4">Deterministic Match</th>
                <th className="py-3.5 px-4">Application Status</th>
                <th className="py-3.5 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app._id} className="hover:bg-slate-50/60 transition">
                  <td className="py-4 px-4">
                    <p className="font-bold text-slate-900 text-sm">{app.candidate?.name}</p>
                    <p className="text-[11px] text-slate-500">{app.candidate?.email}</p>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    <p className="font-semibold text-slate-800">{app.job?.title}</p>
                    <p className="text-[11px] text-slate-400">{app.company?.name}</p>
                  </td>
                  <td className="py-4 px-4">
                    <MatchScoreBadge score={app.matchScore} size="sm" />
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${STATUS_COLORS[app.status] || 'bg-slate-100'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400 text-right">
                    {new Date(app.createdAt).toLocaleString()}
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
