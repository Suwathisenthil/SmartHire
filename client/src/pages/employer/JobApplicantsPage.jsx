import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sparkles,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Eye,
  ArrowLeft,
  Filter,
  Briefcase,
  FileText,
  Mail,
  Phone
} from 'lucide-react';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import MatchBreakdownCard from '../../components/matching/MatchBreakdownCard';
import SkillChip from '../../components/common/SkillChip';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { STATUS_COLORS } from '../../utils/constants';

export default function JobApplicantsPage() {
  const { id } = useParams();
  const [jobTitle, setJobTitle] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [minScore, setMinScore] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Candidate for Profile/Resume Modal
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Schedule Interview Modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [schedulingApplicant, setSchedulingApplicant] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '03:00 PM IST',
    interviewType: 'Online',
    meetingLink: 'https://meet.google.com/abc-smarthire-demo',
    notes: 'Technical discussion on role expectations, coding exercises, and domain experience.'
  });
  const [schedulingLoading, setSchedulingLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchRankedApplicants();
  }, [id, minScore, statusFilter]);

  const fetchRankedApplicants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (minScore > 0) params.append('minScore', minScore);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/matching/candidates/${id}?${params.toString()}`);
      if (res.data.success) {
        setJobTitle(res.data.data.jobTitle || 'Job Role');
        setApplicants(res.data.data.applicants || []);
      }
    } catch (err) {
      console.error('Failed to load candidate ranking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.put(`/applications/${appId}/status`, {
        status: newStatus,
        notes: `Recruiter changed status to ${newStatus}`
      });

      if (res.data.success) {
        setApplicants(prev =>
          prev.map(a => (a.applicationId === appId ? { ...a, status: newStatus } : a))
        );
        setActionSuccess(`Candidate status updated to "${newStatus}"`);
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Status change failed');
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!schedulingApplicant) return;

    setSchedulingLoading(true);
    try {
      const res = await api.post('/interviews', {
        applicationId: schedulingApplicant.applicationId,
        ...interviewForm
      });

      if (res.data.success) {
        setInterviewModalOpen(false);
        setActionSuccess('Interview invitation scheduled & sent to candidate!');
        // Update local applicant status
        setApplicants(prev =>
          prev.map(a =>
            a.applicationId === schedulingApplicant.applicationId
              ? { ...a, status: 'Interview Scheduled' }
              : a
          )
        );
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err) {
      alert(err.message || 'Failed to schedule interview');
    } finally {
      setSchedulingLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/employer/jobs"
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Candidate Ranking: {jobTitle}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold">
                Auto-Ranked
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked descending by deterministic match scores (Skills 60%, Exp 20%, Edu 10%, Certs 10%).
            </p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="0">All Match Scores</option>
            <option value="80">Strong Match (80%+)</option>
            <option value="60">Moderate Match (60%+)</option>
            <option value="40">Low Match (40%+)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="text-slate-500 font-medium">
          {applicants.length} candidates found
        </div>
      </div>

      {/* Ranked Applicants Cards List */}
      {loading ? (
        <LoadingSpinner fullScreen text="Ranking applicants with deterministic engine..." />
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="There are currently no applicants matching your selected filter criteria."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((item, index) => {
            const { candidate, matchScore, scoreBreakdown, matchedSkills, missingSkills, status, applicationId, appliedDate } = item;

            return (
              <div
                key={applicationId}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Candidate Bio & Rank Badge */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-base flex-shrink-0">
                      #{index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-slate-900 text-base">{candidate?.name}</h3>
                        <MatchScoreBadge score={matchScore} size="sm" />
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[status] || 'bg-slate-100'}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{candidate?.headline || 'Candidate'}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-3">
                        <span>{candidate?.location || 'India'}</span>
                        <span>•</span>
                        <span>{candidate?.totalExperienceYears || 0} years experience</span>
                        <span>•</span>
                        <span>Applied {new Date(appliedDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => {
                        setSelectedApplicant(item);
                        setProfileModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details</span>
                    </button>

                    <button
                      onClick={() => {
                        setSchedulingApplicant(item);
                        setInterviewModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule Interview</span>
                    </button>

                    {/* Status Dropdown */}
                    <select
                      value={status}
                      onChange={e => handleStatusChange(applicationId, e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Selected">Selected</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Score breakdown metrics & skills */}
                <div className="pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      Matched Skills ({matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {matchedSkills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                      Missing Required Skills ({missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.length > 0 ? (
                        missingSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-medium">
                            ✗ {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-emerald-700 font-medium text-[11px]">All required skills present!</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Profile & Resume Text Modal */}
      <Modal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        title={`Candidate Evaluation: ${selectedApplicant?.candidate?.name || 'Applicant'}`}
        maxWidth="max-w-3xl"
      >
        {selectedApplicant && (
          <div className="space-y-6 text-xs">
            {/* Contact Details */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{selectedApplicant.candidate?.name}</h4>
                <p className="text-slate-500">{selectedApplicant.candidate?.headline}</p>
              </div>
              <div className="space-y-1 text-slate-600">
                <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedApplicant.candidate?.email}</p>
                <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedApplicant.candidate?.phone || 'Not specified'}</p>
              </div>
            </div>

            {/* Match Breakdown Card */}
            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Full Match Score Breakdown
              </h4>
              <MatchBreakdownCard
                matchData={{
                  score: selectedApplicant.matchScore,
                  skillScore: selectedApplicant.scoreBreakdown?.skillScore || 0,
                  experienceScore: selectedApplicant.scoreBreakdown?.experienceScore || 0,
                  educationScore: selectedApplicant.scoreBreakdown?.educationScore || 0,
                  certificationScore: selectedApplicant.scoreBreakdown?.certificationScore || 0,
                  matchedSkills: selectedApplicant.matchedSkills || [],
                  missingSkills: selectedApplicant.missingSkills || [],
                  preferredSkillsMatched: selectedApplicant.preferredSkillsMatched || [],
                  candidateTotalExperience: selectedApplicant.candidate?.totalExperienceYears || 0,
                  jobRequiredExperience: 2,
                  experienceMatch: selectedApplicant.experienceMatch,
                  educationMatch: selectedApplicant.educationMatch
                }}
              />
            </div>

            {/* Candidate Resume Text Preview */}
            {selectedApplicant.resume?.extractedText && (
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  Extracted Resume Content ({selectedApplicant.resume?.originalFilename})
                </h4>
                <pre className="p-4 rounded-2xl bg-slate-900 text-slate-200 font-mono text-[11px] max-h-56 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {selectedApplicant.resume?.extractedText}
                </pre>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={`Schedule Interview: ${schedulingApplicant?.candidate?.name}`}
      >
        <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
          <p className="text-slate-500">
            An in-app notification and email update will be sent directly to the candidate upon submission.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Interview Date</label>
              <input
                type="date"
                required
                value={interviewForm.date}
                onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Time (with Timezone)</label>
              <input
                type="text"
                required
                value={interviewForm.time}
                onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                placeholder="e.g. 02:30 PM IST"
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Interview Format</label>
              <select
                value={interviewForm.interviewType}
                onChange={e => setInterviewForm({ ...interviewForm, interviewType: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
              >
                <option value="Online">Online Video (Google Meet / Zoom)</option>
                <option value="Phone">Phone Screening</option>
                <option value="In-person">In-person On-site</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Meeting URL / Link</label>
              <input
                type="url"
                value={interviewForm.meetingLink}
                onChange={e => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/..."
                className="w-full p-2.5 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Notes & Agenda</label>
            <textarea
              rows="3"
              value={interviewForm.notes}
              onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setInterviewModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={schedulingLoading}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition flex items-center gap-2"
            >
              {schedulingLoading ? 'Scheduling...' : 'Send Invitation'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
