import React from 'react';
import { Check, AlertTriangle, Star, X } from 'lucide-react';

export default function SkillChip({ skill, variant = 'neutral', onRemove, size = 'md' }) {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs sm:text-sm font-semibold';

  const variants = {
    matched: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 ring-1 ring-emerald-500/20',
    missing: 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-500/20',
    preferred: 'bg-purple-50 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60 ring-1 ring-purple-500/20',
    neutral: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-150 ${variants[variant] || variants.neutral} ${sizeClasses}`}
    >
      {variant === 'matched' && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />}
      {variant === 'missing' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 stroke-[2.2]" />}
      {variant === 'preferred' && <Star className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 fill-purple-600/30" />}
      <span>{skill}</span>
      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove(skill)}
          className="ml-1 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-full p-0.5 focus:outline-none transition"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
