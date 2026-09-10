import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Clock, Video, MapPin, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { STATUS_COLORS } from '../../utils/constants';

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error('Error fetching interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Loading scheduled interviews..." />;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Scheduled Interviews
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review interview dates, times, meeting invitations, and recruiter notes.
        </p>
      </div>

      {interviews.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No interviews scheduled yet"
          description="When employers shortlist your profile and invite you for an interview, it will appear here."
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
                      {int.company?.name}
                    </span>
                    <h3 className="font-bold text-slate-900 text-base">{int.job?.title}</h3>
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
                    <span>Type: <strong>{int.interviewType}</strong></span>
                  </div>
                </div>

                {int.notes && (
                  <div className="text-xs text-slate-500 bg-indigo-50/40 p-3 rounded-xl border border-indigo-100">
                    <strong className="text-indigo-900 block mb-0.5">Recruiter Notes:</strong>
                    {int.notes}
                  </div>
                )}
              </div>

              {int.meetingLink && (
                <div className="pt-3 border-t border-slate-100">
                  <a
                    href={int.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Join Online Meeting</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
