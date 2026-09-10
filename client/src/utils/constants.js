export const ROLE_LABELS = {
  candidate: 'Job Seeker',
  employer: 'Employer',
  admin: 'Platform Admin'
};

export const STATUS_COLORS = {
  Applied: 'bg-blue-100 text-blue-800 border-blue-200',
  'Under Review': 'bg-amber-100 text-amber-800 border-amber-200',
  Shortlisted: 'bg-purple-100 text-purple-800 border-purple-200',
  'Interview Scheduled': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  Selected: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-800 border-rose-200',
  Withdrawn: 'bg-slate-100 text-slate-700 border-slate-200',
  Active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Closed: 'bg-slate-100 text-slate-700 border-slate-200',
  Draft: 'bg-amber-100 text-amber-800 border-amber-200',
  Approved: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-800 border-amber-200'
};

export const getScoreBadgeColor = (score) => {
  if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50 text-emerald-700 border-emerald-200', ring: 'ring-emerald-500' };
  if (score >= 60) return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50 text-amber-700 border-amber-200', ring: 'ring-amber-500' };
  return { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50 text-rose-700 border-rose-200', ring: 'ring-rose-500' };
};

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
export const JOB_TYPES = ['Full Time', 'Part Time', 'Internship', 'Contract'];
