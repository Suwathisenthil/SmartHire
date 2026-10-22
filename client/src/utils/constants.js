export const ROLE_LABELS = {
  candidate: 'Job Seeker',
  employer: 'Employer',
  admin: 'Platform Admin'
};

export const STATUS_COLORS = {
  Applied: 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Under Review': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Shortlisted: 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Interview Scheduled': 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  Selected: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Rejected: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  Withdrawn: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  Active: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Closed: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  Draft: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  Approved: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  Pending: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
};

export const getScoreBadgeColor = (score) => {
  if (score >= 80) {
    return {
      bg: 'bg-emerald-500',
      text: 'text-emerald-700 dark:text-emerald-400',
      light: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80',
      ring: 'ring-emerald-500',
      stroke: '#10b981',
      glow: 'shadow-glow-emerald',
      tier: 'Strong Fit'
    };
  }
  if (score >= 60) {
    return {
      bg: 'bg-amber-500',
      text: 'text-amber-700 dark:text-amber-400',
      light: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/80',
      ring: 'ring-amber-500',
      stroke: '#f59e0b',
      glow: 'shadow-glow-amber',
      tier: 'Moderate Fit'
    };
  }
  return {
    bg: 'bg-rose-500',
    text: 'text-rose-700 dark:text-rose-400',
    light: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80',
    ring: 'ring-rose-500',
    stroke: '#f43f5e',
    glow: '',
    tier: 'Skill Gap'
  };
};

export const WORK_MODES = ['Remote', 'Hybrid', 'On-site'];
export const JOB_TYPES = ['Full Time', 'Part Time', 'Internship', 'Contract'];
