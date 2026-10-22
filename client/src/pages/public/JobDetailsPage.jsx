import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Briefcase,
  MapPin,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowLeft,
  Award,
  AlertTriangle,
  Check,
  ShieldCheck,
  Cpu,
  UserCheck
} from 'lucide-react';
import MatchBreakdownCard from '../../components/matching/MatchBreakdownCard';
import MatchScoreBadge from '../../components/common/MatchScoreBadge';
import SkillChip from '../../components/common/SkillChip';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate, isEmployer } = useAuth();

  const [job, setJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [existingApplication, setExistingApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState('');

  useEffect(() => {
    fetchJobDetails();
  }, [id, isAuthenticated]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/jobs/${id}`);
      if (res.data.success) {
        setJob(res.data.data.job);
      }

      // If candidate is logged in, fetch live match calculation and check if applied
      if (isCandidate) {
        try {
          const matchRes = await api.get(`/matching/job/${id}`);
          if (matchRes.data.success) {
            setMatchData(matchRes.data.data);
          }

          const myAppsRes = await api.get('/applications/my');
          if (myAppsRes.data.success) {
            const app = myAppsRes.data.data.applications.find(
              a => a.job?._id === id || a.job === id
            );
            if (app) setExistingApplication(app);
          }
        } catch (e) {
          console.error('Match/Application check failed:', e);
        }
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplyError('');
    setSubmitting(true);

    try {
      const res = await api.post('/applications', {
        jobId: id,
        coverNote
      });

      if (res.data.success) {
        setApplySuccess(true);
        setExistingApplication(res.data.data.application);
        setTimeout(() => {
          setApplyModalOpen(false);
        }, 1500);
      }
    } catch (err) {
      setApplyError(err.message || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen text="Evaluating job requirements and candidate intelligence..." />;
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Job Opening Not Found</h2>
        <Link to="/jobs" className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 text-sm font-bold hover:underline">
          ← Back to All Openings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Openings</span>
      </Link>

      {/* Main Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 transition-colors">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-2xl shadow-xs flex-shrink-0">
              {job.company?.name?.charAt(0) || 'C'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {job.title}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{job.company?.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" /> {job.location}
                </span>
                <span>•</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{job.workMode}</span>
              </p>
            </div>
          </div>

          {/* If Candidate, show Live Match Score Badge */}
          {isCandidate && matchData && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Your Match Rating
              </span>
              <MatchScoreBadge score={matchData.score} size="lg" />
            </div>
          )}
        </div>

        {/* Highlight Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{job.jobType}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{job.requiredExperience ? `${job.requiredExperience}+ years experience` : 'Freshers Welcome'}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{job.education || "Bachelor's Degree in CS/IT"}</span>
          </span>
          {job.salary?.max > 0 && (
            <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              ₹{job.salary.min.toLocaleString()} - ₹{job.salary.max.toLocaleString()} {job.salary.period}
            </span>
          )}
        </div>

        {/* CTA Bar */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            <span className="mx-2">•</span>
            <span>{job.applicantsCount || 0} applicants so far</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isCandidate ? (
              existingApplication ? (
                <div className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Applied on {new Date(existingApplication.createdAt).toLocaleDateString()} ({existingApplication.status})</span>
                </div>
              ) : (
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit 1-Click Application</span>
                </button>
              )
            ) : !isAuthenticated ? (
              <Link
                to={`/login?redirect=/jobs/${id}`}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition text-center"
              >
                Sign In to Apply
              </Link>
            ) : isEmployer ? (
              <Link
                to={`/employer/jobs/${id}/applicants`}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition"
              >
                Inspect Candidate Rankings
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* WHY YOU MATCH (FOR CANDIDATES) */}
      {isCandidate && matchData && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-black text-slate-900 dark:text-white">Why You Match</h2>
          </div>
          <MatchBreakdownCard matchData={matchData} />
        </div>
      )}

      {/* JOB REQUIREMENTS Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <h2 className="text-lg font-black text-slate-900 dark:text-white">JOB REQUIREMENTS</h2>

        {/* Required Skills */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Mandatory Skills ({job.requiredSkills?.length || 0})
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills?.map((skill, index) => {
              const isMatched = matchData?.matchedSkills?.includes(skill);
              const isMissing = matchData?.missingSkills?.includes(skill);

              return (
                <SkillChip
                  key={index}
                  skill={skill}
                  variant={isMatched ? 'matched' : isMissing ? 'missing' : 'neutral'}
                  size="md"
                />
              );
            })}
          </div>
        </div>

        {/* Preferred Skills */}
        {job.preferredSkills?.length > 0 && (
          <div className="space-y-2.5 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Preferred Bonus Skills ({job.preferredSkills.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.preferredSkills.map((skill, index) => (
                <SkillChip key={index} skill={skill} variant="preferred" size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Experience & Education Matching Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <Briefcase className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>EXPERIENCE REQUIREMENT</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Required: <strong>{job.requiredExperience ? `${job.requiredExperience} Years` : '0 Years (Entry Level)'}</strong>
            </p>
            {matchData && (
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                Your profile: {matchData.candidateTotalExperience || 0} years verified
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>EDUCATION REQUIREMENT</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Target: <strong>{job.education || "Bachelor's Degree in CS or equivalent"}</strong>
            </p>
            {matchData && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                {matchData.educationMatch ? 'Degree qualification satisfied' : 'Alternative credential evaluated'}
              </p>
            )}
          </div>
        </div>

        {/* Full Job Description */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Job Description & Responsibilities
          </h3>
          <div className="prose dark:prose-invert text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {job.description}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={applyModalOpen} onClose={() => setApplyModalOpen(false)} title={`Apply for ${job.title}`}>
        {applySuccess ? (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Submitted!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your resume snapshot and computed match score of {matchData?.score || 85}% have been delivered to the employer.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4 text-xs">
            {applyError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {applyError}
              </div>
            )}

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 dark:text-indigo-200">Matching Engine Snapshot</span>
                <span className="font-black text-indigo-700 dark:text-indigo-400 text-sm">
                  {matchData?.score || 85}% Match
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                The recruiter will see your deterministic breakdown: Skills ({matchData?.skillScore || 85}%), Experience ({matchData?.experienceScore || 100}%), Education ({matchData?.educationScore || 100}%).
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Candidate Note / Cover Message (Optional)
              </label>
              <textarea
                rows="4"
                value={coverNote}
                onChange={e => setCoverNote(e.target.value)}
                placeholder="Mention why you are passionate about this role and relevant projects..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Confirm Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
