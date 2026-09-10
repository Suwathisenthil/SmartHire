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
  ArrowLeft
} from 'lucide-react';
import MatchBreakdownCard from '../../components/matching/MatchBreakdownCard';
import SkillChip from '../../components/common/SkillChip';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate } = useAuth();

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

  if (loading) return <LoadingSpinner fullScreen text="Loading job posting..." />;
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800">Job Opening Not Found</h2>
        <Link to="/jobs" className="mt-4 inline-block text-indigo-600 text-sm font-semibold hover:underline">
          ← Back to All Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Jobs</span>
      </Link>

      {/* Main Header Card */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold text-2xl shadow-xs">
              {job.company?.name?.charAt(0) || 'C'}
            </div>
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {job.title}
              </h1>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <span className="font-semibold text-slate-900">{job.company?.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location} ({job.workMode})
                </span>
              </p>
            </div>
          </div>

          {/* Action Button: Apply or Already Applied */}
          <div className="self-start md:self-auto flex flex-col items-end gap-2">
            {existingApplication ? (
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Application Submitted ({existingApplication.status})</span>
              </div>
            ) : isCandidate ? (
              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Apply Now</span>
              </button>
            ) : !isAuthenticated ? (
              <Link
                to="/login"
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md transition flex items-center gap-2"
              >
                <span>Sign in to Apply</span>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Quick Spec Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Job Type</span>
            <span className="font-bold text-slate-800">{job.jobType}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Experience</span>
            <span className="font-bold text-slate-800">{job.requiredExperience}+ years</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Compensation</span>
            <span className="font-bold text-slate-800">
              ₹{job.salary?.min ? (job.salary.min / 100000).toFixed(1) + 'L' : 'Competitive'} - ₹{job.salary?.max ? (job.salary.max / 100000).toFixed(1) + 'L' : 'Best'} {job.salary?.period}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <span className="text-slate-400 block mb-0.5">Application Deadline</span>
            <span className="font-bold text-slate-800">{new Date(job.deadline).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Live Match Engine Breakdown for Logged-In Candidates */}
      {isCandidate && matchData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Your Live Resume Match Analysis</span>
            </h2>
          </div>
          <MatchBreakdownCard matchData={matchData} />
        </div>
      )}

      {/* Detailed Description */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2">Job Description</h3>
          <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3">Required Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.map((skill, idx) => (
              <SkillChip key={idx} skill={skill} variant="neutral" />
            ))}
          </div>
        </div>

        {/* Preferred Skills */}
        {job.preferredSkills?.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3">Preferred Bonus Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.preferredSkills.map((skill, idx) => (
                <SkillChip key={idx} skill={skill} variant="preferred" />
              ))}
            </div>
          </div>
        )}

        {/* Education Requirement */}
        {job.education && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
            <GraduationCap className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            <div>
              <span className="font-bold text-slate-800 block">Educational Qualifications</span>
              <span className="text-slate-600">{job.education}</span>
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        {applySuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Application Submitted!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your profile and match score snapshot have been sent to the recruiter. You can track status in your applications dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            {applyError && (
              <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{applyError}</span>
              </div>
            )}

            {matchData && (
              <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-indigo-900 block">Your Current Match Score</span>
                  <span className="text-indigo-600">Calculated based on your verified skills</span>
                </div>
                <span className="text-base font-extrabold text-indigo-700">{matchData.score}%</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cover Note / Message for Recruiter (Optional)
              </label>
              <textarea
                rows="4"
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly explain why you are an ideal fit for this role..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setApplyModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-70"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
