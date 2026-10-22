import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Sparkles,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Send,
  Eye,
  ArrowLeft,
  Filter,
  Briefcase,
  FileText,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Award,
  GraduationCap,
  ExternalLink,
  Cpu
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

  // Expandable "Why this candidate matches" toggles per candidate
  const [expandedMatchId, setExpandedMatchId] = useState(null);

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

  const toggleWhyMatch = (appId) => {
    setExpandedMatchId(prev => (prev === appId ? null : appId));
  };

  return (
    <div className="space-y-6 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <Link
            to="/employer/jobs"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                Deterministic Ranking
              </span>
              <span className="text-xs font-bold text-slate-400">
                {applicants.length} evaluated applicants
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              Candidate Ranking: {jobTitle}
            </h1>
          </div>
        </div>

        <Link
          to={`/jobs/${id}`}
          className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>View Job Details</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs transition-colors">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter Pool:
          </span>

          <select
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            <option value="0">All Match Scores</option>
            <option value="80">Strong Fit (80%+)</option>
            <option value="60">Moderate Fit (60%+)</option>
            <option value="40">Low Match (40%+)</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white font-medium focus:outline-none"
          >
            <option value="">All Application Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="text-[11px] font-bold text-slate-400">
          Ranked descending by Match Score (Skills 60%, Exp 20%, Edu 10%, Certs 10%)
        </div>
      </div>

      {/* Candidate Ranking List */}
      {loading ? (
        <LoadingSpinner text="Computing candidate match rankings..." />
      ) : applicants.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates found"
          description="There are currently no applicant submissions matching the selected score or status filters."
        />
      ) : (
        <div className="space-y-4">
          {applicants.map((item, index) => {
            const {
              applicationId,
              status,
              appliedDate,
              candidate,
              matchScore,
              scoreBreakdown,
              matchedSkills = [],
              missingSkills = [],
              experienceMatch = false,
              educationMatch = false
            } = item;

            const isExpanded = expandedMatchId === applicationId;

            return (
              <div
                key={applicationId}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-700 transition"
              >
                {/* Main Summary Row */}
                <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left: Rank & Profile details */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-lg flex-shrink-0">
                      #{index + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-black text-slate-900 dark:text-white text-base">
                          {candidate?.name || 'Candidate'}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[status] || 'bg-slate-100'}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                        {candidate?.headline || 'Candidate Professional'}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-3 mt-1">
                        <span>{candidate?.location || 'India'}</span>
                        <span>•</span>
                        <span>{candidate?.totalExperienceYears || 0} years experience</span>
                        <span>•</span>
                        <span>Applied {new Date(appliedDate).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Center: Dominant Match Score & Mini Sub-score Tags */}
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        Match Score
                      </span>
                      <MatchScoreBadge score={matchScore} size="lg" showLabel={false} />
                    </div>

                    <div className="hidden sm:flex flex-col gap-1 text-[11px] text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Skills: <strong className="text-slate-900 dark:text-white">{scoreBreakdown?.skillScore || 0}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Experience: <strong className="text-slate-900 dark:text-white">{scoreBreakdown?.experienceScore || 0}%</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        <span>Education: <strong className="text-slate-900 dark:text-white">{scoreBreakdown?.educationScore || 0}%</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                    <button
                      onClick={() => toggleWhyMatch(applicationId)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Why Candidate Matches</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={() => {
                        setSelectedApplicant(item);
                        setProfileModalOpen(true);
                      }}
                      className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      title="Inspect Candidate Profile & Resume"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {status !== 'Shortlisted' && status !== 'Selected' && (
                      <button
                        onClick={() => handleStatusChange(applicationId, 'Shortlisted')}
                        className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 font-bold text-xs border border-emerald-200 dark:border-emerald-800 transition"
                      >
                        Shortlist
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setSchedulingApplicant(item);
                        setInterviewModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
                    >
                      Schedule Interview
                    </button>
                  </div>
                </div>

                {/* Collapsible "Why this candidate matches" Section */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 space-y-4">
                    <div className="flex items-center gap-2 pt-2">
                      <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                        Why this candidate matches ({matchScore}% Overall Fit)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Matched skills */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
                        <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Matched Skills ({matchedSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedSkills.length > 0 ? (
                            matchedSkills.map((s, i) => (
                              <SkillChip key={i} skill={s} variant="matched" size="sm" />
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">No skills matched directly.</span>
                          )}
                        </div>
                      </div>

                      {/* Missing skills */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 space-y-2">
                        <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 uppercase">
                          <AlertTriangle className="w-3.5 h-3.5" /> Missing Skills ({missingSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {missingSkills.length > 0 ? (
                            missingSkills.map((s, i) => (
                              <SkillChip key={i} skill={s} variant="missing" size="sm" />
                            ))
                          ) : (
                            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                              Candidate possesses all required skills!
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Criteria Badges */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                      <span className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                        scoreBreakdown?.experienceScore >= 80
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Experience Match: {scoreBreakdown?.experienceScore || 0}%</span>
                      </span>

                      <span className={`px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 ${
                        scoreBreakdown?.educationScore >= 70
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}>
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Education Match: {scoreBreakdown?.educationScore || 0}%</span>
                      </span>

                      <span className="px-3 py-1 rounded-xl font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Certifications Match: {scoreBreakdown?.certificationScore || 0}%</span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Profile Modal */}
      {selectedApplicant && (
        <Modal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          title={`Candidate Profile: ${selectedApplicant.candidate?.name}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-lg">{selectedApplicant.candidate?.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedApplicant.candidate?.headline}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                  <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {selectedApplicant.candidate?.email}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedApplicant.candidate?.location || 'India'}</span>
                </div>
              </div>
              <MatchScoreBadge score={selectedApplicant.matchScore} size="lg" />
            </div>

            {/* Candidate Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Candidate Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedApplicant.candidate?.skills?.map((s, i) => (
                  <SkillChip key={i} skill={s} size="sm" />
                ))}
              </div>
            </div>

            {/* Full 4-part breakdown */}
            <MatchBreakdownCard matchData={{
              score: selectedApplicant.matchScore,
              skillScore: selectedApplicant.scoreBreakdown?.skillScore || 0,
              experienceScore: selectedApplicant.scoreBreakdown?.experienceScore || 0,
              educationScore: selectedApplicant.scoreBreakdown?.educationScore || 0,
              certificationScore: selectedApplicant.scoreBreakdown?.certificationScore || 0,
              matchedSkills: selectedApplicant.matchedSkills || [],
              missingSkills: selectedApplicant.missingSkills || [],
              candidateTotalExperience: selectedApplicant.candidate?.totalExperienceYears || 0,
              jobRequiredExperience: 0
            }} />
          </div>
        </Modal>
      )}

      {/* Schedule Interview Modal */}
      {schedulingApplicant && (
        <Modal
          isOpen={interviewModalOpen}
          onClose={() => setInterviewModalOpen(false)}
          title={`Schedule Interview: ${schedulingApplicant.candidate?.name}`}
        >
          <form onSubmit={handleScheduleInterview} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Interview Date</label>
              <input
                type="date"
                required
                value={interviewForm.date}
                onChange={e => setInterviewForm({ ...interviewForm, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Time & Timezone</label>
              <input
                type="text"
                required
                value={interviewForm.time}
                onChange={e => setInterviewForm({ ...interviewForm, time: e.target.value })}
                placeholder="e.g. 03:00 PM IST"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Meeting Link</label>
              <input
                type="url"
                required
                value={interviewForm.meetingLink}
                onChange={e => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                placeholder="https://meet.google.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Agenda & Candidate Notes</label>
              <textarea
                rows="3"
                value={interviewForm.notes}
                onChange={e => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setInterviewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={schedulingLoading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold disabled:opacity-50"
              >
                {schedulingLoading ? 'Scheduling...' : 'Send Interview Invitation'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
