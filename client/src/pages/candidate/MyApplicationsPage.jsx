import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Send, Clock, CheckCircle2, AlertCircle, History, ArrowRight } from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { STATUS_COLORS } from '../../utils/constants';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my');
      if (res.data.success) {
        setApplications(res.data.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) return;
    try {
      const res = await api.put(`/applications/${appId}/withdraw`);
      if (res.data.success) {
        fetchApplications();
      }
    } catch (err) {
      alert(err.message || 'Failed to withdraw');
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading applications..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Application Tracking & History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your application lifecycle, recruiter status changes, and interview progression.
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          description="Browse available job openings and submit your first application."
          actionText="Browse Jobs"
          onAction={() => window.location.href = '/jobs'}
        />
      ) : (
        <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4">Match Score</th>
                  <th className="py-3.5 px-4">Current Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-4 px-4">
                      <Link
                        to={`/jobs/${app.job?._id || app.job}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 transition block text-sm"
                      >
                        {app.job?.title || 'Position'}
                      </Link>
                      <span className="text-slate-500">{app.company?.name} • {app.job?.location}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-600">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <MatchScoreBadge score={app.matchScore} size="sm" />
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold border text-[10px] ${STATUS_COLORS[app.status] || 'bg-slate-100'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setHistoryModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition"
                        title="View Status Timeline"
                      >
                        <History className="w-4 h-4" />
                      </button>

                      {app.status !== 'Withdrawn' && app.status !== 'Selected' && app.status !== 'Rejected' && (
                        <button
                          onClick={() => handleWithdraw(app._id)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 text-[11px] font-medium transition"
                        >
                          Withdraw
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Status History Timeline Modal */}
      <Modal
        isOpen={historyModalOpen}
        onClose={() => setHistoryModalOpen(false)}
        title={`Application History: ${selectedApp?.job?.title || 'Application'}`}
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 flex items-center justify-between">
            <span className="text-slate-500">Employer:</span>
            <span className="font-bold text-slate-800">{selectedApp?.company?.name}</span>
          </div>

          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Status Progression</h4>
            <div className="relative border-l-2 border-indigo-200 ml-4 pl-4 space-y-4">
              {selectedApp?.statusHistory?.map((item, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-600 ring-4 ring-white" />
                  <p className="font-bold text-slate-900">{item.status}</p>
                  <p className="text-[10px] text-slate-400">{new Date(item.date).toLocaleString()}</p>
                  {item.notes && <p className="text-slate-600 text-xs mt-0.5">{item.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
