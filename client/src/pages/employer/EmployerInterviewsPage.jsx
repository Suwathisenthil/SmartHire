import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, Video, User, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { STATUS_COLORS } from '../../utils/constants';

export default function EmployerInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [editForm, setEditForm] = useState({ status: 'Scheduled', notes: '', meetingLink: '' });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/interviews');
      if (res.data.success) {
        setInterviews(res.data.data.interviews || []);
      }
    } catch (err) {
      console.error('Failed to load interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedInterview) return;

    try {
      const res = await api.put(`/interviews/${selectedInterview._id}`, editForm);
      if (res.data.success) {
        setInterviews(prev =>
          prev.map(i => (i._id === selectedInterview._id ? res.data.data.interview : i))
        );
        setEditModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to update interview');
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading recruiter interviews..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Scheduled Candidate Interviews
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage upcoming interview schedules, update status, and record recruiter feedback.
        </p>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="Schedule interviews with qualified applicants directly from your candidate ranking view."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interviews.map((int) => (
            <div
              key={int._id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block mb-0.5">
                      {int.job?.title}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{int.candidate?.name}</span>
                    </h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[int.status] || 'bg-slate-100'}`}>
                    {int.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(int.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{int.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-slate-400" />
                    <span>Format: <strong>{int.interviewType}</strong></span>
                  </div>
                </div>

                {int.notes && (
                  <p className="text-xs text-slate-500 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                    <strong className="text-indigo-900 block mb-0.5">Notes:</strong>
                    {int.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {int.meetingLink ? (
                  <a
                    href={int.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Meeting</span>
                  </a>
                ) : <span />}

                <button
                  onClick={() => {
                    setSelectedInterview(int);
                    setEditForm({
                      status: int.status || 'Scheduled',
                      notes: int.notes || '',
                      meetingLink: int.meetingLink || ''
                    });
                    setEditModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
                >
                  Update Status / Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Interview Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Interview Status"
      >
        <form onSubmit={handleUpdate} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Status</label>
            <select
              value={editForm.status}
              onChange={e => setEditForm({ ...editForm, status: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Rescheduled">Rescheduled</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Meeting Link</label>
            <input
              type="url"
              value={editForm.meetingLink}
              onChange={e => setEditForm({ ...editForm, meetingLink: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Interview Notes / Feedback</label>
            <textarea
              rows="3"
              value={editForm.notes}
              onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
